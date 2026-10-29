from django.core.management.base import BaseCommand
from api.models import (
    VillagePlace,
    Grievance,
    ServiceApplication,
    MandiRate,
    FertilizerStock,
    VillageNotice,
    HealthSchedule
)

class Command(BaseCommand):
    help = "Seed database with realistic Indian village data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding GramSeva village database with multi-place data...")

        # Clear existing
        VillagePlace.objects.all().delete()
        Grievance.objects.all().delete()
        ServiceApplication.objects.all().delete()
        MandiRate.objects.all().delete()
        FertilizerStock.objects.all().delete()
        VillageNotice.objects.all().delete()
        HealthSchedule.objects.all().delete()

        # 0. Seed Searchable Places (Gram Panchayats)
        p1 = VillagePlace.objects.create(
            name="Pipariya",
            gram_panchayat="Gram Panchayat Pipariya",
            full_name="Pipariya Gram Panchayat, Tehsil Sohagpur, Narmadapuram, Madhya Pradesh",
            tehsil="Sohagpur",
            district="Narmadapuram",
            state="Madhya Pradesh",
            pincode="461775",
            lat=22.7553,
            lng=78.3551,
            population=8450,
            total_wards=7
        )

        p2 = VillagePlace.objects.create(
            name="Rampur",
            gram_panchayat="Gram Panchayat Rampur",
            full_name="Rampur Gram Panchayat, Tehsil Babai, Narmadapuram, Madhya Pradesh",
            tehsil="Babai",
            district="Narmadapuram",
            state="Madhya Pradesh",
            pincode="461661",
            lat=22.7121,
            lng=77.9234,
            population=6120,
            total_wards=5
        )

        p3 = VillagePlace.objects.create(
            name="Khedi",
            gram_panchayat="Gram Panchayat Khedi",
            full_name="Khedi Gram Panchayat, Tehsil Sehore, Sehore, Madhya Pradesh",
            tehsil="Sehore",
            district="Sehore",
            state="Madhya Pradesh",
            pincode="466001",
            lat=23.2011,
            lng=77.0854,
            population=4900,
            total_wards=6
        )

        p4 = VillagePlace.objects.create(
            name="Semri Harchand",
            gram_panchayat="Gram Panchayat Semri Harchand",
            full_name="Semri Harchand Gram Panchayat, Tehsil Sohagpur, Narmadapuram, Madhya Pradesh",
            tehsil="Sohagpur",
            district="Narmadapuram",
            state="Madhya Pradesh",
            pincode="461668",
            lat=22.7833,
            lng=78.2167,
            population=7300,
            total_wards=6
        )

        p5 = VillagePlace.objects.create(
            name="Mandla Rural",
            gram_panchayat="Gram Panchayat Bamhani",
            full_name="Bamhani Gram Panchayat, Tehsil Nainpur, Mandla, Madhya Pradesh",
            tehsil="Nainpur",
            district="Mandla",
            state="Madhya Pradesh",
            pincode="481771",
            lat=22.6000,
            lng=80.3700,
            population=5200,
            total_wards=5
        )

        # 1. Grievances across different villages
        Grievance.objects.create(
            ticket_id="GRM-2026-101",
            village_name="Pipariya",
            district="Narmadapuram",
            state="Madhya Pradesh",
            citizen_name="Rameshwar Patel",
            mobile="9827011223",
            ward="Ward 3 - Patel Mohalla",
            category="Drinking Water Pipeline",
            urgency="CRITICAL",
            description="Main 100mm drinking water supply pipeline fractured near the community center. Over 45 households experiencing zero potable water supply for 3 consecutive days.",
            landmark="Near Shiv Temple Crossing, Ward 3",
            status="IN_PROGRESS",
            assigned_to="PHE Lineman Mahendra & Tanker Division",
            resolution_notes="Emergency water tanker deployed. Valve replacement crew dispatched on site.",
            funds_allocated=4500
        )

        Grievance.objects.create(
            ticket_id="GRM-2026-102",
            village_name="Pipariya",
            district="Narmadapuram",
            state="Madhya Pradesh",
            citizen_name="Kamla Bai Ahirwar",
            mobile="9406522334",
            ward="Ward 5 - Harijan Basti",
            category="Handpump & Groundwater",
            urgency="URGENT",
            description="Community handpump handle sheared off and rusted water discharge reported. Residents compelled to fetch water from private tube-wells 1.5 km away.",
            landmark="Adjacent to Anganwadi Centre 2",
            status="PENDING",
            assigned_to="Panchayat Secretary",
            resolution_notes="",
            funds_allocated=0
        )

        Grievance.objects.create(
            ticket_id="GRM-2026-103",
            village_name="Pipariya",
            district="Narmadapuram",
            state="Madhya Pradesh",
            citizen_name="Govind Prasad Sharma",
            mobile="9981233445",
            ward="Ward 1 - Gandhi Chowk",
            category="Power Grid & Transformer",
            urgency="CRITICAL",
            description="25 KVA agricultural transformer burnt after electrical surge. 35 farmer tube-well connections inactive during the critical wheat irrigation phase.",
            landmark="Near Primary School Sports Ground",
            status="SANCTIONED",
            assigned_to="Discom Assistant Engineer Office Sohagpur",
            resolution_notes="Discom replacement indent #8892 officially sanctioned from Panchayat contingency fund.",
            funds_allocated=28000
        )

        Grievance.objects.create(
            ticket_id="GRM-2026-104",
            village_name="Rampur",
            district="Narmadapuram",
            state="Madhya Pradesh",
            citizen_name="Dinesh Kushwaha",
            mobile="8878901234",
            ward="Ward 2 - Narmada Marg",
            category="Drainage & Road Culvert",
            urgency="NORMAL",
            description="Drainage culvert slab cracked due to monsoon overflow. Tractor trolleys loaded with harvested grains unable to traverse safely.",
            landmark="Canal Bridge Mile 2",
            status="PENDING",
            assigned_to="Panchayat Secretary Rampur",
            resolution_notes="",
            funds_allocated=0
        )

        Grievance.objects.create(
            ticket_id="GRM-2026-105",
            village_name="Khedi",
            district="Sehore",
            state="Madhya Pradesh",
            citizen_name="Savitri Devi",
            mobile="9754123456",
            ward="Ward 4 - Station Road",
            category="Public Street Lighting",
            urgency="NORMAL",
            description="Five solar street lights failed due to battery depletion. Entire intersection pitch dark post 7 PM.",
            landmark="Near Old Police Outpost",
            status="RESOLVED",
            assigned_to="Solar Maintenance Unit",
            resolution_notes="LED drivers and lithium battery modules replaced by authorized vendor.",
            funds_allocated=3200
        )

        # 2. Service Applications
        ServiceApplication.objects.create(
            token_number="GSK-2026-4401",
            village_name="Pipariya",
            applicant_name="Mohan Lal Yadav",
            guardian_name="Babulal Yadav",
            mobile="9826198765",
            aadhaar_last_four="8832",
            ward="Ward 3 - Patel Mohalla",
            service_type="PM-Kisan Samman Nidhi e-KYC & Land Seeding",
            reason="16th installment halted due to land registration record mismatch in revenue portal.",
            status="UNDER_VERIFICATION",
            officer_remarks="Revenue records cross-checked on MP Bhulekh. Forwarded to Patwari for sign-off.",
            appointment_date="Friday (Panchayat Bhavan)"
        )

        ServiceApplication.objects.create(
            token_number="GSK-2026-4402",
            village_name="Pipariya",
            applicant_name="Pooja Ahirwar",
            guardian_name="Kallu Ahirwar",
            mobile="9755443322",
            aadhaar_last_four="4519",
            ward="Ward 5 - Harijan Basti",
            service_type="Caste Certificate Verification",
            reason="Required for Government College merit scholarship application.",
            status="APPROVED",
            officer_remarks="Village Kotwar panchnama verified. Digital authorization seal affixed.",
            appointment_date="Immediate Digital Download"
        )

        ServiceApplication.objects.create(
            token_number="GSK-2026-4403",
            village_name="Rampur",
            applicant_name="Parvati Bai",
            guardian_name="Late Jagdish Prasad",
            mobile="9111223344",
            aadhaar_last_four="1290",
            ward="Ward 1 - Basti",
            service_type="Social Security Widow Pension",
            reason="Monthly subsistence assistance application under State Social Security scheme.",
            status="SUBMITTED",
            officer_remarks="Death certificate attached. Awaiting Gram Sabha committee ratification.",
            appointment_date="Next Gram Sabha"
        )

        # 3. Mandi Rates
        MandiRate.objects.create(
            crop_name="Wheat (Lokwan / Sharbati)",
            crop_name_hindi="Wheat (Sharbati Quality)",
            modal_price=2480,
            min_price=2320,
            max_price=2650,
            msp_price=2275,
            trend="UP",
            market_name="Krishi Upaj Mandi Samiti Pipariya"
        )
        MandiRate.objects.create(
            crop_name="Paddy (Basmati / 1509)",
            crop_name_hindi="Paddy (Basmati)",
            modal_price=3720,
            min_price=3400,
            max_price=3950,
            msp_price=2300,
            trend="UP",
            market_name="Krishi Upaj Mandi Samiti Pipariya"
        )
        MandiRate.objects.create(
            crop_name="Mustard (Black / Yellow)",
            crop_name_hindi="Mustard",
            modal_price=5420,
            min_price=5100,
            max_price=5680,
            msp_price=5650,
            trend="DOWN",
            market_name="Krishi Upaj Mandi Samiti Pipariya"
        )
        MandiRate.objects.create(
            crop_name="Soybean (Yellow Gold)",
            crop_name_hindi="Soybean",
            modal_price=4620,
            min_price=4300,
            max_price=4800,
            msp_price=4892,
            trend="STABLE",
            market_name="Krishi Upaj Mandi Samiti Pipariya"
        )

        # 4. Fertilizer Stock
        FertilizerStock.objects.create(
            fertilizer_name="Neem Coated Urea (45 kg bag)",
            category="Nitrogen",
            bags_available=420,
            price_per_bag=266.50,
            center_name="PACS Seva Sahakari Samiti Godown",
            contact_phone="9425012345",
            is_in_stock=True
        )
        FertilizerStock.objects.create(
            fertilizer_name="IFFCO DAP (18:46:0 - 50 kg bag)",
            category="Phosphorus",
            bags_available=145,
            price_per_bag=1350.00,
            center_name="PACS Seva Sahakari Samiti Godown",
            contact_phone="9425012345",
            is_in_stock=True
        )
        FertilizerStock.objects.create(
            fertilizer_name="NPK Complex (12:32:16 - 50 kg bag)",
            category="Complex",
            bags_available=90,
            price_per_bag=1470.00,
            center_name="PACS Seva Sahakari Samiti Godown",
            contact_phone="9425012345",
            is_in_stock=True
        )

        # 5. Village Notices
        VillageNotice.objects.create(
            title="Gram Sabha Annual Budget & Works Meeting",
            category="PANCHAYAT_SESSION",
            description="Official Gram Sabha convened to finalize MGNREGA works agenda, village drainage allocations, and PM Awas beneficiary lists.",
            priority="HIGH",
            event_date="Monday, 2nd November at 10:30 AM",
            venue="Panchayat Bhavan Hall, Pipariya",
            issued_by="Sarpanch & Village Development Officer"
        )
        VillageNotice.objects.create(
            title="Free Cataract Screening & Medical Camp",
            category="HEALTH_CAMP",
            description="Specialist medical team from District Civil Hospital providing free diagnosis, spectacle distributions, and surgical referrals.",
            priority="HIGH",
            event_date="Thursday, 5th November (09:00 - 15:00)",
            venue="Primary Health Sub-Centre, Ward 1",
            issued_by="Block Medical Officer & ASHA Team"
        )
        VillageNotice.objects.create(
            title="Emergency Potable Water Tanker Schedule (Ward 3 & 4)",
            category="CIVIC_SUPPLY",
            description="Two scheduled tanker deliveries deployed daily (07:00 - 10:00 & 17:00 - 20:00) during pipeline valve maintenance.",
            priority="URGENT",
            event_date="Active through Saturday",
            venue="Ward 3 Crossing & Ambedkar Bhavan",
            issued_by="PHE Department & Gram Panchayat"
        )

        # 6. Health Schedules
        HealthSchedule.objects.create(
            practitioner_name="Dr. R. K. Saxena (MBBS)",
            designation="Community Medical Officer",
            service_type="General Outpatient OPD & Chronic Disease Clinic",
            visiting_time="Monday & Thursday (09:30 - 13:30)",
            location="Primary Health Sub-Centre, Ward 1",
            contact_number="9826019283",
            medicine_stock="Adequate Stock (ORS, Antibiotics, Antipyretics)"
        )
        HealthSchedule.objects.create(
            practitioner_name="Smt. Manju Ahirwar (ANM)",
            designation="Auxiliary Nurse Midwife",
            service_type="Child Routine Immunization (Polio, BCG, DPT) & ANC Checkups",
            visiting_time="Every Wednesday & Saturday (10:00 - 14:00)",
            location="Anganwadi Centre 1 & 2",
            contact_number="9407182736",
            medicine_stock="Vaccines & Nutritional Supplements Stocked"
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded multi-place GramSeva database!"))
