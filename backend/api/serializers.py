from rest_framework import serializers
from .models import (
    VillagePlace,
    Grievance,
    ServiceApplication,
    MandiRate,
    FertilizerStock,
    VillageNotice,
    HealthSchedule
)

def mask_name(name):
    if not name:
        return "Citizen (Protected)"
    parts = name.strip().split()
    masked_parts = []
    for p in parts:
        if len(p) <= 2:
            masked_parts.append(p[0] + "*")
        else:
            masked_parts.append(p[0] + "*" * (len(p) - 2) + p[-1])
    return " ".join(masked_parts)

def mask_phone(phone):
    if not phone:
        return "+91 ******"
    clean = "".join(filter(str.isdigit, phone))
    if len(clean) >= 10:
        return f"+91 {clean[:2]}******{clean[-2:]}"
    return "****" + clean[-4:] if len(clean) >= 4 else "******"


class VillagePlaceSerializer(serializers.ModelSerializer):
    grievance_count = serializers.SerializerMethodField()
    critical_count = serializers.SerializerMethodField()

    class Meta:
        model = VillagePlace
        fields = '__all__'

    def get_grievance_count(self, obj):
        return Grievance.objects.filter(village_name__icontains=obj.name).count()

    def get_critical_count(self, obj):
        return Grievance.objects.filter(
            village_name__icontains=obj.name,
            urgency='CRITICAL'
        ).exclude(status='RESOLVED').count()


class GrievanceSerializer(serializers.ModelSerializer):
    citizen_name_display = serializers.SerializerMethodField()
    mobile_display = serializers.SerializerMethodField()
    is_masked = serializers.SerializerMethodField()

    class Meta:
        model = Grievance
        fields = '__all__'

    def is_officer(self):
        request = self.context.get('request')
        if not request:
            return False
        # Check custom officer auth token header or session
        token = request.headers.get('X-Officer-Token') or request.META.get('HTTP_X_OFFICER_TOKEN')
        return bool(token and token.startswith('OFFICER_SECURE_')) or request.user.is_authenticated

    def get_is_masked(self, obj):
        return not self.is_officer()

    def get_citizen_name_display(self, obj):
        if self.is_officer():
            return obj.citizen_name
        return mask_name(obj.citizen_name)

    def get_mobile_display(self, obj):
        if self.is_officer():
            return obj.mobile
        return mask_phone(obj.mobile)


class ServiceApplicationSerializer(serializers.ModelSerializer):
    applicant_name_display = serializers.SerializerMethodField()
    mobile_display = serializers.SerializerMethodField()
    is_masked = serializers.SerializerMethodField()

    class Meta:
        model = ServiceApplication
        fields = '__all__'

    def is_officer(self):
        request = self.context.get('request')
        if not request:
            return False
        token = request.headers.get('X-Officer-Token') or request.META.get('HTTP_X_OFFICER_TOKEN')
        return bool(token and token.startswith('OFFICER_SECURE_')) or request.user.is_authenticated

    def get_is_masked(self, obj):
        return not self.is_officer()

    def get_applicant_name_display(self, obj):
        if self.is_officer():
            return obj.applicant_name
        return mask_name(obj.applicant_name)

    def get_mobile_display(self, obj):
        if self.is_officer():
            return obj.mobile
        return mask_phone(obj.mobile)


class MandiRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MandiRate
        fields = '__all__'


class FertilizerStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = FertilizerStock
        fields = '__all__'


class VillageNoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VillageNotice
        fields = '__all__'


class HealthScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthSchedule
        fields = '__all__'
