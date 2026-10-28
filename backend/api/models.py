from django.db import models
from django.utils import timezone
import random

class Grievance(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending / लंबित'),
        ('IN_PROGRESS', 'In Progress / कार्यवाही जारी'),
        ('SANCTIONED', 'Fund Sanctioned / बजट स्वीकृत'),
        ('RESOLVED', 'Resolved / निस्तारित'),
        ('REJECTED', 'Rejected / अस्वीकृत'),
    ]

    URGENCY_CHOICES = [
        ('NORMAL', 'Normal / सामान्य'),
        ('URGENT', 'Urgent / आवश्यक'),
        ('CRITICAL', 'Emergency / अति-आवश्यक'),
    ]

    ticket_id = models.CharField(max_length=30, unique=True, blank=True)
    citizen_name = models.CharField(max_length=150)
    mobile = models.CharField(max_length=15)
    ward = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='NORMAL')
    description = models.TextField()
    landmark = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    assigned_to = models.CharField(max_length=150, blank=True, default='Panchayat Secretary')
    resolution_notes = models.TextField(blank=True)
    funds_allocated = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            rand_code = random.randint(1000, 9999)
            self.ticket_id = f"GRM-{timezone.now().year}-{rand_code}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_id} - {self.category} ({self.ward})"


class ServiceApplication(models.Model):
    STATUS_CHOICES = [
        ('SUBMITTED', 'Submitted / प्राप्त'),
        ('UNDER_VERIFICATION', 'Under Verification / सत्यापन जारी'),
        ('APPROVED', 'Approved / स्वीकृत'),
        ('READY_FOR_PICKUP', 'Ready for Digital Pickup / जारी'),
        ('REJECTED', 'Rejected / निरस्त'),
    ]

    token_number = models.CharField(max_length=30, unique=True, blank=True)
    applicant_name = models.CharField(max_length=150)
    guardian_name = models.CharField(max_length=150)
    mobile = models.CharField(max_length=15)
    aadhaar_last_four = models.CharField(max_length=4)
    ward = models.CharField(max_length=100)
    service_type = models.CharField(max_length=150)
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='SUBMITTED')
    officer_remarks = models.TextField(blank=True)
    appointment_date = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.token_number:
            rand_code = random.randint(1000, 9999)
            self.token_number = f"GSK-{timezone.now().year}-{rand_code}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.token_number} - {self.applicant_name} ({self.service_type})"


class MandiRate(models.Model):
    TREND_CHOICES = [
        ('UP', 'Rising / बढ़त (+5%)'),
        ('DOWN', 'Falling / गिरावट (-3%)'),
        ('STABLE', 'Stable / स्थिर'),
    ]

    crop_name = models.CharField(max_length=100)
    crop_name_hindi = models.CharField(max_length=100)
    modal_price = models.DecimalField(max_digits=10, decimal_places=2) # Per Quintal
    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2)
    msp_price = models.DecimalField(max_digits=10, decimal_places=2)
    trend = models.CharField(max_length=10, choices=TREND_CHOICES, default='STABLE')
    market_name = models.CharField(max_length=150, default='Tehsil Mandi Samiti')
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.crop_name} - ₹{self.modal_price}/Qtl"


class FertilizerStock(models.Model):
    fertilizer_name = models.CharField(max_length=150)
    category = models.CharField(max_length=50, default='Fertilizer')
    bags_available = models.IntegerField(default=0)
    price_per_bag = models.DecimalField(max_digits=8, decimal_places=2)
    center_name = models.CharField(max_length=150, default='Village PACS Cooperative Godown')
    contact_phone = models.CharField(max_length=15, default='9876543210')
    is_in_stock = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.fertilizer_name} ({self.bags_available} bags)"


class VillageNotice(models.Model):
    PRIORITY_CHOICES = [
        ('NORMAL', 'General / सामान्य'),
        ('HIGH', 'Important / महत्वपूर्ण'),
        ('URGENT', 'Emergency / आपातकालीन'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='NORMAL')
    event_date = models.CharField(max_length=100, blank=True)
    venue = models.CharField(max_length=200, blank=True)
    issued_by = models.CharField(max_length=150, default='Gram Panchayat Sachiv / Pradhan')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class HealthSchedule(models.Model):
    practitioner_name = models.CharField(max_length=150)
    designation = models.CharField(max_length=150)
    service_type = models.CharField(max_length=200)
    visiting_time = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=15)
    medicine_stock = models.CharField(max_length=100, default='Adequate / पूर्ण उपलब्धता')

    def __str__(self):
        return f"{self.practitioner_name} - {self.service_type}"
