from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Sum, Q
from .models import (
    VillagePlace,
    Grievance,
    ServiceApplication,
    MandiRate,
    FertilizerStock,
    VillageNotice,
    HealthSchedule
)
from .serializers import (
    VillagePlaceSerializer,
    GrievanceSerializer,
    ServiceApplicationSerializer,
    MandiRateSerializer,
    FertilizerStockSerializer,
    VillageNoticeSerializer,
    HealthScheduleSerializer
)

class OfficerLoginView(APIView):
    """
    Officer Authentication View.
    No sign up required. Pre-configured officers can log in directly.
    """
    def post(self, request):
        officer_id = request.data.get('officer_id', '').strip()
        password = request.data.get('password', '').strip()

        # Authorized officer credentials
        OFFICER_ROSTER = {
            'vdo.pipariya': {
                'pin': 'admin123',
                'name': 'Shri Rajesh Verma',
                'designation': 'Village Development Officer (VDO)',
                'panchayat': 'Gram Panchayat Pipariya',
                'district': 'Narmadapuram',
                'badge': 'VDO-MP-701'
            },
            'sachiv.rampur': {
                'pin': 'admin123',
                'name': 'Smt. Anita Sharma',
                'designation': 'Panchayat Secretary (Sachiv)',
                'panchayat': 'Gram Panchayat Rampur',
                'district': 'Narmadapuram',
                'badge': 'SEC-MP-412'
            },
            'officer': {
                'pin': 'officer123',
                'name': 'District Panchayat Inspector',
                'designation': 'Nodal Panchayat Inspector',
                'panchayat': 'All Gram Panchayats',
                'district': 'Narmadapuram Division',
                'badge': 'INS-MP-109'
            }
        }

        user_info = OFFICER_ROSTER.get(officer_id.lower())
        if user_info and user_info['pin'] == password:
            token = f"OFFICER_SECURE_{officer_id.upper()}_SESSION"
            return Response({
                "success": True,
                "token": token,
                "officer": {
                    "officer_id": officer_id,
                    "name": user_info['name'],
                    "designation": user_info['designation'],
                    "panchayat": user_info['panchayat'],
                    "district": user_info['district'],
                    "badge": user_info['badge'],
                }
            })
        
        return Response({
            "success": False,
            "error": "Invalid Officer ID or Password. Default demo accounts: vdo.pipariya (pass: admin123) or officer (pass: officer123)"
        }, status=status.HTTP_401_UNAUTHORIZED)


class VillagePlaceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VillagePlace.objects.all().order_by('name')
    serializer_class = VillagePlaceSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        query = self.request.query_params.get('search', '').strip()
        if query:
            qs = qs.filter(
                Q(name__icontains=query) |
                Q(gram_panchayat__icontains=query) |
                Q(tehsil__icontains=query) |
                Q(district__icontains=query) |
                Q(pincode__icontains=query)
            )
        return qs


class GrievanceViewSet(viewsets.ModelViewSet):
    queryset = Grievance.objects.all().order_by('-created_at')
    serializer_class = GrievanceSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        qs = super().get_queryset()
        village = self.request.query_params.get('village', '').strip()
        ward = self.request.query_params.get('ward', '').strip()
        urgency = self.request.query_params.get('urgency', '').strip()
        status_filter = self.request.query_params.get('status', '').strip()

        if village and village != 'ALL':
            qs = qs.filter(Q(village_name__icontains=village) | Q(ward__icontains=village))
        if ward:
            qs = qs.filter(ward__icontains=ward)
        if urgency:
            qs = qs.filter(urgency=urgency)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    @action(detail=False, methods=['get'])
    def track(self, request):
        """Anyone can track any complaint by Ticket ID with privacy protection"""
        ticket_id = request.query_params.get('ticket_id', '').strip()
        if not ticket_id:
            return Response({"error": "Provide ticket_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        matches = Grievance.objects.filter(ticket_id__iexact=ticket_id)
        if not matches.exists():
            return Response({"error": "No grievance found with this ticket number"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(matches.first())
        return Response(serializer.data)

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
        serializer = self.get_serializer(grievance)
        return Response(serializer.data)


class ServiceApplicationViewSet(viewsets.ModelViewSet):
    queryset = ServiceApplication.objects.all().order_by('-created_at')
    serializer_class = ServiceApplicationSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'])
    def quick_decision(self, request, pk=None):
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
        serializer = self.get_serializer(app)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def track_token(self, request):
        query = request.query_params.get('query', '').strip()
        if not query:
            return Response({"error": "Provide token number or mobile"}, status=status.HTTP_400_BAD_REQUEST)
        
        matches = ServiceApplication.objects.filter(
            token_number__iexact=query
        ) | ServiceApplication.objects.filter(mobile=query)
        
        serializer = self.get_serializer(matches, many=True)
        return Response(serializer.data)


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
    Officer Command Center 1-View Metric Engine
    """
    def get(self, request):
        village = request.query_params.get('village', '').strip()
        qs = Grievance.objects.all()
        if village and village != 'ALL':
            qs = qs.filter(Q(village_name__icontains=village) | Q(ward__icontains=village))

        total_grievances = qs.count()
        pending_grievances = qs.filter(status='PENDING').count()
        in_progress = qs.filter(status='IN_PROGRESS').count()
        resolved_grievances = qs.filter(status='RESOLVED').count()
        critical_unresolved = qs.filter(
            urgency__in=['URGENT', 'CRITICAL']
        ).exclude(status__in=['RESOLVED', 'REJECTED']).count()

        total_funds_sanctioned = qs.aggregate(
            total=Sum('funds_allocated')
        )['total'] or 0

        ward_distribution = list(
            qs.values('ward')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        pending_applications = ServiceApplication.objects.filter(
            status__in=['SUBMITTED', 'UNDER_VERIFICATION']
        ).count()
        approved_applications = ServiceApplication.objects.filter(
            status__in=['APPROVED', 'READY_FOR_PICKUP']
        ).count()

        fertilizers = list(FertilizerStock.objects.values('fertilizer_name', 'bags_available', 'price_per_bag'))
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
