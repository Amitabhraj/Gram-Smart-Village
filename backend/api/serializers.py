from rest_framework import serializers
from .models import (
    Grievance,
    ServiceApplication,
    MandiRate,
    FertilizerStock,
    VillageNotice,
    HealthSchedule
)

class GrievanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grievance
        fields = '__all__'


class ServiceApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceApplication
        fields = '__all__'


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
