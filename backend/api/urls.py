from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GrievanceViewSet,
    ServiceApplicationViewSet,
    MandiRateViewSet,
    FertilizerStockViewSet,
    VillageNoticeViewSet,
    HealthScheduleViewSet,
    OfficerDashboardSummaryView
)

router = DefaultRouter()
router.register(r'grievances', GrievanceViewSet, basename='grievance')
router.register(r'services', ServiceApplicationViewSet, basename='service')
router.register(r'mandi-rates', MandiRateViewSet, basename='mandi-rate')
router.register(r'fertilizers', FertilizerStockViewSet, basename='fertilizer')
router.register(r'notices', VillageNoticeViewSet, basename='notice')
router.register(r'health-schedules', HealthScheduleViewSet, basename='health-schedule')

urlpatterns = [
    path('officer-summary/', OfficerDashboardSummaryView.as_view(), name='officer-summary'),
    path('', include(router.urls)),
]
