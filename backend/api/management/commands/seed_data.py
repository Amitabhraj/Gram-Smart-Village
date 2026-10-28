import os
from django.core.management.base import BaseCommand
from api.models import (
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
        self.stdout.write("Seeding GramSeva village database...")

        # Clear existing
        Grievance.objects.all().delete()
        ServiceApplication.objects.all().delete()
        MandiRate.objects.all().delete()
        FertilizerStock.objects.all().delete()
        VillageNotice.objects.all().delete()
        HealthSchedule.objects.all().delete()

        # 1. Grievances
        g1 = Grievance.objects.create(
            ticket_id="GRM-2026-101",
            citizen_name="Rameshwar Patel",
            mobile="9827011223",
            ward="Ward 3 - Patel Mohalla",
            category="Water Supply / नल-जल योजना",
            urgency="CRITICAL",
            description="Jal Jeevan main pipeline cracked near Shiv Temple. 45 households have had zero drinking water for 3 days. Water tanker needed immediately.",
            landmark="Near Shiv Mandir, Ward 3",
            status="IN_PROGRESS",
            assigned_to="PHE Lineman Mahendra & Tanker Incharge",
            resolution_notes="Water tanker dispatched for today morning. Valve replacement team assigned.",
            funds_allocated=4500
        )

        g2 = Grievance.objects.create(
            ticket_id="GRM-2026-102",
            citizen_name="Kamla Bai Ahirwar",
            mobile="9406522334",
            ward="Ward 5 - Harijan Basti",
            category="Sanitation & Handpump / हैंडपंप",
            urgency="URGENT",
            description="Handpump lever broken and red contaminated water coming out. Villagers forced to walk 1.5 km to agricultural tube well.",
            landmark="Near Anganwadi Center 2",
            status="PENDING",
            assigned_to="Panchayat Secretary",
            resolution_notes="",
            funds_allocated=0
        )

        g3 = Grievance.objects.create(
            ticket_id="GRM-2026-103",
            citizen_name="Govind Prasad Sharma",
            mobile="9981233445",
            ward="Ward 1 - Gandhi Chowk",
            category="Electricity & Transformer / बिजली",
            urgency="CRITICAL",
            description="25 KVA transformer burnt after heavy lightning yesterday evening. All tube-wells for wheat sowing are without power.",
            landmark="Near Primary School Ground",
            status="SANCTIONED",
            assigned_to="Discom JE Office Sohapur",
            resolution_notes="JE informed. Indent #8892 raised with District Electricity Board.",
            funds_allocated=28000
        )

        g4 = Grievance.objects.create(
            ticket_id="GRM-2026-104",
            citizen_name="Dinesh Kushwaha",
            mobile="8878901234",
            ward="Ward 4 - Narmada Road",
            category="Roads & Culvert / सड़क एवं पुलिया",
            urgency="NORMAL",
            description="Culvert near drainage canal cracked. Tractors cannot pass loaded with harvest grains safely.",
            landmark="Canal Bridge Mile 2",
            status="PENDING",
            assigned_to="Panchayat Secretary",
            resolution_notes="",
            funds_allocated=0
        )

        g5 = Grievance.objects.create(
            ticket_id="GRM-2026-105",
            citizen_name="Savitri Devi",
            mobile="9754123456",
            ward="Ward 2 - Purana Thana",
            category="Street Light / स्ट्रीट लाइट",
            urgency="NORMAL",
            description="Four solar street lights have dead batteries. Area pitch dark after 7 PM causing fear of snake bites and theft.",
            landmark="Purana Thana Gali",
            status="RESOLVED",
            assigned_to="Solar Vendor Team",
            resolution_notes="All 4 LED driver units and battery cables replaced by technician.",
            funds_allocated=3200
        )

        # 2. Service Applications (Certificates & Schemes)
        s1 = ServiceApplication.objects.create(
            token_number="GSK-2026-4401",
            applicant_name="Mohan Lal Yadav",
            guardian_name="Babulal Yadav",
            mobile="9826198765",
            aadhaar_last_four="8832",
            ward="Ward 3 - Patel Mohalla",
            service_type="PM-Kisan Samman Nidhi e-KYC & Land Seeding",
            reason="16th installment blocked due to land registration mismatch in Bhulekh portal.",
            status="UNDER_VERIFICATION",
            officer_remarks="Khasra #114/2 checked on MP Bhulekh. Forwarded to Patwari for sign off.",
            appointment_date="Friday, 31st Oct (Panchayat Bhavan)"
        )

        s2 = ServiceApplication.objects.create(
            token_number="GSK-2026-4402",
            applicant_name="Pooja Ahirwar",
            guardian_name="Kallu Ahirwar",
            mobile="9755443322",
            aadhaar_last_four="4519",
            ward="Ward 5 - Harijan Basti",
            service_type="Caste Certificate Verification (जाति प्रमाण पत्र)",
            reason="Needed for Government College scholarship application before 10th Nov deadline.",
            status="APPROVED",
            officer_remarks="Kotwar panchnama verified. Digital sign stamped. Ready for certificate download.",
            appointment_date="Immediate Pickup"
        )

        s3 = ServiceApplication.objects.create(
            token_number="GSK-2026-4403",
            applicant_name="Parvati Bai",
            guardian_name="Late Jagdish Prasad",
            mobile="9111223344",
            aadhaar_last_four="1290",
            ward="Ward 2 - Purana Thana",
            service_type="Widow Pension Endorsement (विधवा पेंशन)",
            reason="Husband passed away in March. Applying for Social Security Monthly Pension.",
            status="SUBMITTED",
            officer_remarks="Death certificate attached. Awaiting Gram Sabha committee sign.",
            appointment_date="Gram Sabha on 2nd Nov"
        )

        s4 = ServiceApplication.objects.create(
            token_number="GSK-2026-4404",
            applicant_name="Anil Kumar Vishwakarma",
            guardian_name="Ram Charan Vishwakarma",
            mobile="9893332211",
            aadhaar_last_four="9042",
            ward="Ward 1 - Gandhi Chowk",
            service_type="Income Certificate Verification (आय प्रमाण पत्र)",
            reason="Required for Kisan Credit Card (KCC) loan application at Central Bank.",
            status="READY_FOR_PICKUP",
            officer_remarks="Verified annual income ₹72,000. Certificate sealed.",
            appointment_date="Ready at Common Service Centre desk"
        )

        # 3. Mandi Rates
        MandiRate.objects.create(
            crop_name="Wheat (Lokwan / Sharbati)",
            crop_name_hindi="गेहूं (लोकवान / शरबती)",
            modal_price=2480,
            min_price=2320,
            max_price=2650,
            msp_price=2275,
            trend="UP",
            market_name="Krishi Upaj Mandi Samiti Pipariya"
        )
        MandiRate.objects.create(
            crop_name="Paddy (Basmati / Pusa)",
            crop_name_hindi="धान (बासमती / 1509)",
            modal_price=3720,
            min_price=3400,
            max_price=3950,
            msp_price=2300,
            trend="UP",
            market_name="Krishi Upaj Mandi Samiti Pipariya"
        )
        MandiRate.objects.create(
            crop_name="Mustard (Sarson)",
            crop_name_hindi="सरसों (काली / पीली)",
            modal_price=5420,
            min_price=5100,
            max_price=5680,
            msp_price=5650,
            trend="DOWN",
            market_name="Krishi Upaj Mandi Samiti Pipariya"
        )
        MandiRate.objects.create(
            crop_name="Soybean (Yellow)",
            crop_name_hindi="सोयाबीन (पीला सोना)",
            modal_price=4620,
            min_price=4300,
            max_price=4800,
            msp_price=4892,
            trend="STABLE",
            market_name="Krishi Upaj Mandi Samiti Pipariya"
        )
        MandiRate.objects.create(
            crop_name="Potato (Fresh Harvest)",
            crop_name_hindi="आलू (नया आलू)",
            modal_price=1350,
            min_price=1100,
            max_price=1500,
            msp_price=0,
            trend="DOWN",
            market_name="Subzi Mandi Yard"
        )

        # 4. Fertilizer Stock
        FertilizerStock.objects.create(
            fertilizer_name="Neem Coated Urea (नीम लेपित यूरिया - 45kg)",
            category="Nitrogen",
            bags_available=420,
            price_per_bag=266.50,
            center_name="PACS Seva Sahakari Samiti Godown",
            contact_phone="9425012345",
            is_in_stock=True
        )
        FertilizerStock.objects.create(
            fertilizer_name="IFFCO DAP (डीएपी 18:46:0 - 50kg)",
            category="Phosphorus",
            bags_available=145,
            price_per_bag=1350.00,
            center_name="PACS Seva Sahakari Samiti Godown",
            contact_phone="9425012345",
            is_in_stock=True
        )
        FertilizerStock.objects.create(
            fertilizer_name="NPK (12:32:16 Complex - 50kg)",
            category="Complex",
            bags_available=90,
            price_per_bag=1470.00,
            center_name="PACS Seva Sahakari Samiti Godown",
            contact_phone="9425012345",
            is_in_stock=True
        )
        FertilizerStock.objects.create(
            fertilizer_name="Zinc Sulphate (33% Micro-nutrient)",
            category="Micronutrient",
            bags_available=18,
            price_per_bag=320.00,
            center_name="Agri Input Counter",
            contact_phone="9425012345",
            is_in_stock=True
        )

        # 5. Village Notices
        VillageNotice.objects.create(
            title="Gram Sabha Annual Action Plan Meeting (ग्राम सभा बैठक)",
            category="GRAM_SABHA",
            description="Special Gram Sabha scheduled to approve MGNREGA works, village drainage budget, and finalize PM Awas list. All adult residents requested to participate.",
            priority="HIGH",
            event_date="Monday, 2nd Nov at 10:30 AM",
            venue="Panchayat Bhavan Prangan",
            issued_by="Sarpanch & Village Development Officer (VDO)"
        )
        VillageNotice.objects.create(
            title="Free Cataract & Eye Checkup Camp (नेत्र जांच एवं मोतियाबिंद शिविर)",
            category="HEALTH_CAMP",
            description="District Red Cross Society & District Hospital specialist team will conduct free checkups, distribute spectacles, and register cataract surgeries.",
            priority="HIGH",
            event_date="Thursday, 5th Nov (9 AM - 3 PM)",
            venue="Primary Health Sub-Centre Rampur",
            issued_by="Block Medical Officer & ASHA Team"
        )
        VillageNotice.objects.create(
            title="Ward 3 Emergency Drinking Water Tanker Timing",
            category="WATER_SUPPLY",
            description="Due to main pipeline maintenance at Shiv Mandir chowk, two drinking water tankers will be stationed from 7:00 AM to 10:00 AM and 5:00 PM to 8:00 PM daily until Saturday.",
            priority="URGENT",
            event_date="Ongoing until Saturday",
            venue="Ward 3 Chauraha & Ambedkar Bhavan",
            issued_by="PHE Department & Gram Panchayat"
        )

        # 6. Health Schedules
        HealthSchedule.objects.create(
            practitioner_name="Dr. R. K. Saxena (MBBS)",
            designation="Community Medical Officer",
            service_type="General OPD, Diabetes & Blood Pressure Clinic",
            visiting_time="Monday & Thursday (9:30 AM - 1:30 PM)",
            location="Primary Health Sub-Centre, Ward 1",
            contact_number="9826019283",
            medicine_stock="Adequate (ORS, Paracetamol, Antibiotics available)"
        )
        HealthSchedule.objects.create(
            practitioner_name="Smt. Manju Ahirwar (ANM)",
            designation="Auxiliary Nurse Midwife",
            service_type="Child Routine Immunization (Polio, BCG, DPT) & ANC Checkups",
            visiting_time="Every Wednesday & Saturday (10:00 AM - 2:00 PM)",
            location="Anganwadi Center 1 & 2",
            contact_number="9407182736",
            medicine_stock="Vaccines & Iron Folic Acid fully stocked"
        )
        HealthSchedule.objects.create(
            practitioner_name="Dr. Arvind Verma (BAMS)",
            designation="Ayush Medical Practitioner",
            service_type="Ayurvedic Wellness, Joint Pain & Seasonal Flu Consultation",
            visiting_time="Every Tuesday (10:00 AM - 2:00 PM)",
            location="Panchayat Bhavan Health Room",
            contact_number="9753198274",
            medicine_stock="Herbal Kadha & Ayurvedic tonics available"
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded GramSeva database!"))
