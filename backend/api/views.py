from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Sum
from .models import (
    Grievance,
    ServiceApplication,
    MandiRate,
    FertilizerStock,
    VillageNotice,
    HealthSchedule
)
from .serializers import (
    GrievanceSerializer,
    ServiceApplicationSerializer,
    MandiRateSerializer,
    FertilizerStockSerializer,
    VillageNoticeSerializer,
    HealthScheduleSerializer
)

class GrievanceViewSet(viewsets.ModelViewSet):
    queryset = Grievance.objects.all().order_by('-created_at')
    serializer_class = GrievanceSerializer

    @action(detail=True, methods=['post'])
    def quick_action(self, request, pk=None):
        """1-click officer status update without prompts or complex forms"""
        grievance = self.get_object()
        new_status = request.data.get('status')
        assigned_to = request.data.get('assigned_to')
        funds_allocated = request.data.get('funds_allocated')
        notes = request.data.get('notes', '')

        if new_status:
            grievance.status = new_status
        if assigned_to:
            grievance.assigned_to = assigned_to
        if funds_allocated is not None:
            grievance.funds_allocated = int(funds_allocated)
        if notes:
            grievance.resolution_notes = notes

        grievance.save()
        return Response(GrievanceSerializer(grievance).data)


class ServiceApplicationViewSet(viewsets.ModelViewSet):
    queryset = ServiceApplication.objects.all().order_by('-created_at')
    serializer_class = ServiceApplicationSerializer

    @action(detail=True, methods=['post'])
    def quick_decision(self, request, pk=None):
        """1-click officer approval/rejection/delivery token generator"""
        app = self.get_object()
        decision = request.data.get('status')
        remarks = request.data.get('remarks', '')
        appointment_date = request.data.get('appointment_date', '')

        if decision:
            app.status = decision
        if remarks:
            app.officer_remarks = remarks
        if appointment_date:
            app.appointment_date = appointment_date

        app.save()
        return Response(ServiceApplicationSerializer(app).data)

    @action(detail=False, methods=['get'])
    def track_token(self, request):
        """Villager 1-click token tracker by Token Number or Mobile"""
        query = request.query_params.get('query', '').strip()
        if not query:
            return Response({"error": "Provide token number or mobile"}, status=status.HTTP_400_BAD_REQUEST)
        
        matches = ServiceApplication.objects.filter(
            token_number__iexact=query
        ) | ServiceApplication.objects.filter(mobile=query)
        
        return Response(ServiceApplicationSerializer(matches, many=True).data)


class MandiRateViewSet(viewsets.ModelViewSet):
    queryset = MandiRate.objects.all().order_by('crop_name')
    serializer_class = MandiRateSerializer


class FertilizerStockViewSet(viewsets.ModelViewSet):
    queryset = FertilizerStock.objects.all().order_by('fertilizer_name')
    serializer_class = FertilizerStockSerializer


class VillageNoticeViewSet(viewsets.ModelViewSet):
    queryset = VillageNotice.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = VillageNoticeSerializer


class HealthScheduleViewSet(viewsets.ModelViewSet):
    queryset = HealthSchedule.objects.all().order_by('practitioner_name')
    serializer_class = HealthScheduleSerializer


class OfficerDashboardSummaryView(APIView):
    """
    Solves Officer Problem in ONE VIEW:
    Zero AI prompts needed. Gives instant counts, ward bottlenecks,
    budget sanctions, and urgent attention items.
    """
    def get(self, request):
        total_grievances = Grievance.objects.count()
        pending_grievances = Grievance.objects.filter(status='PENDING').count()
        in_progress = Grievance.objects.filter(status='IN_PROGRESS').count()
        resolved_grievances = Grievance.objects.filter(status='RESOLVED').count()
        critical_unresolved = Grievance.objects.filter(
            urgency__in=['URGENT', 'CRITICAL']
        ).exclude(status__in=['RESOLVED', 'REJECTED']).count()

        total_funds_sanctioned = Grievance.objects.aggregate(
            total=Sum('funds_allocated')
        )['total'] or 0

        # Grievances grouped by Ward
        ward_distribution = list(
            Grievance.objects.values('ward')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # Pending Certificate Applications
        pending_applications = ServiceApplication.objects.filter(
            status__in=['SUBMITTED', 'UNDER_VERIFICATION']
        ).count()
        approved_applications = ServiceApplication.objects.filter(
            status__in=['APPROVED', 'READY_FOR_PICKUP']
        ).count()

        # Fertilizer status at local PACS
        fertilizers = list(FertilizerStock.objects.values('fertilizer_name', 'bags_available', 'price_per_bag'))

        # Active urgent notices
        urgent_notices = VillageNotice.objects.filter(is_active=True, priority__in=['HIGH', 'URGENT']).count()

        return Response({
            "metrics": {
                "total_grievances": total_grievances,
                "pending_grievances": pending_grievances,
                "in_progress": in_progress,
                "resolved_grievances": resolved_grievances,
                "critical_unresolved": critical_unresolved,
                "total_funds_sanctioned": total_funds_sanctioned,
                "pending_applications": pending_applications,
                "approved_applications": approved_applications,
                "urgent_notices": urgent_notices,
            },
            "ward_bottlenecks": ward_distribution,
            "fertilizer_stocks": fertilizers
        })
