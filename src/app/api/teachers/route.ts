import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Mock initial database for teachers & students if DB is fresh
const mockTeachers = [
  {
    id: 't-101',
    name: 'Prof. Anitha Ramesh',
    email: 'anitha@oxfordedu.in',
    phone: '+91 98401 23456',
    subject: 'Mathematics',
    department: 'High School',
    assignedClasses: ['Grade 10-A', 'Grade 10-B', 'Grade 9-A'],
    status: 'ACTIVE',
    geoPunchIn: { status: 'PUNCHED_IN', time: '08:15 AM', location: 'School Campus (Geo-verified)' }
  },
  {
    id: 't-102',
    name: 'Mr. Rajesh Kumar',
    email: 'rajesh@oxfordedu.in',
    phone: '+91 98402 34567',
    subject: 'Physics',
    department: 'Higher Secondary',
    assignedClasses: ['Grade 11-A', 'Grade 12-B'],
    status: 'ACTIVE',
    geoPunchIn: { status: 'PUNCHED_IN', time: '08:20 AM', location: 'School Campus (Geo-verified)' }
  },
  {
    id: 't-103',
    name: 'Ms. Meenakshi S.',
    email: 'meenakshi@oxfordedu.in',
    phone: '+91 98403 45678',
    subject: 'English & Literature',
    department: 'Middle School',
    assignedClasses: ['Grade 8-A', 'Grade 8-B'],
    status: 'ACTIVE',
    geoPunchIn: { status: 'NOT_PUNCHED', time: '-', location: '-' }
  }
];

const mockStudents = [
  { id: 'st-1', rollNo: '10A01', name: 'Aarav Kumar', class: 'Grade 10-A', parentName: 'Suresh Kumar', parentPhone: '+91 98765 43210', attendancePercent: 96, overallGrade: 'A+', totalAbsents: 2 },
  { id: 'st-2', rollNo: '10A02', name: 'Kavya S.', class: 'Grade 10-A', parentName: 'Sundararajan', parentPhone: '+91 98765 43211', attendancePercent: 98, overallGrade: 'O', totalAbsents: 1 },
  { id: 'st-3', rollNo: '10A03', name: 'Rahul Dravid M.', class: 'Grade 10-A', parentName: 'Murugan P.', parentPhone: '+91 98765 43212', attendancePercent: 88, overallGrade: 'B+', totalAbsents: 5 },
  { id: 'st-4', rollNo: '10A04', name: 'Priya Sharma', class: 'Grade 10-A', parentName: 'Vijay Sharma', parentPhone: '+91 98765 43213', attendancePercent: 94, overallGrade: 'A', totalAbsents: 3 },
  { id: 'st-5', rollNo: '10A05', name: 'Siddharth V.', class: 'Grade 10-A', parentName: 'Venkatesh R.', parentPhone: '+91 98765 43214', attendancePercent: 92, overallGrade: 'A', totalAbsents: 4 },
  
  { id: 'st-6', rollNo: '10B01', name: 'Divya Nair', class: 'Grade 10-B', parentName: 'Ramesh Nair', parentPhone: '+91 98765 43215', attendancePercent: 95, overallGrade: 'A+', totalAbsents: 2 },
  { id: 'st-7', rollNo: '10B02', name: 'Karthik Raja', class: 'Grade 10-B', parentName: 'Shanmugam K.', parentPhone: '+91 98765 43216', attendancePercent: 90, overallGrade: 'B', totalAbsents: 6 },
  { id: 'st-8', rollNo: '9A01', name: 'Niveditha R.', class: 'Grade 9-A', parentName: 'Raghavan T.', parentPhone: '+91 98765 43217', attendancePercent: 99, overallGrade: 'O', totalAbsents: 0 }
];

const mockPeriods = [
  { periodNo: 1, time: '08:30 AM - 09:15 AM', class: 'Grade 10-A', subject: 'Mathematics', room: 'Room 204', topic: 'Quadratic Equations Ex 4.2', status: 'COMPLETED' },
  { periodNo: 2, time: '09:20 AM - 10:05 AM', class: 'Grade 9-A', subject: 'Mathematics', room: 'Room 102', topic: 'Polynomials & Factoring', status: 'IN_PROGRESS' },
  { periodNo: 3, time: '10:15 AM - 11:00 AM', class: 'Grade 10-B', subject: 'Mathematics', room: 'Room 205', topic: 'Coordinate Geometry', status: 'UPCOMING' },
  { periodNo: 4, time: '11:05 AM - 11:50 AM', class: 'Free / Staff Room', subject: 'Lesson Planning', room: 'Faculty Block', topic: 'Exam Paper Correction', status: 'UPCOMING' },
  { periodNo: 5, time: '12:30 PM - 01:15 PM', class: 'Grade 10-A', subject: 'Math Practical Lab', room: 'Math Lab 1', topic: 'Geogebra Graph Plotting', status: 'UPCOMING' },
  { periodNo: 6, time: '01:20 PM - 02:05 PM', class: 'Grade 9-A', subject: 'Remedial Math', room: 'Room 102', topic: 'Problem Solving Practice', status: 'UPCOMING' }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'get_students') {
      const className = searchParams.get('class');
      const filtered = className ? mockStudents.filter(s => s.class === className) : mockStudents;
      return NextResponse.json({ success: true, students: filtered });
    }

    if (action === 'get_periods') {
      return NextResponse.json({ success: true, periods: mockPeriods });
    }

    // Default: return all teachers
    let dbUsers: any[] = [];
    try {
      dbUsers = await db.user.findMany({ where: { role: 'TEACHER' } });
    } catch (e) {
      console.log('DB query fallback to mock');
    }

    return NextResponse.json({
      success: true,
      teachers: dbUsers.length > 0 ? dbUsers : mockTeachers,
      periods: mockPeriods,
      students: mockStudents
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Create New Teacher (Admin action)
    if (action === 'create_teacher') {
      const { name, email, password, phone, subject, department, assignedClasses } = body;

      if (!name || !email) {
        return NextResponse.json({ success: false, error: 'Name and Email are required' }, { status: 400 });
      }

      // Try creating in DB
      try {
        const tenant = await db.tenant.findFirst({ where: { businessCategory: 'EDUCATION' } });
        const tenantId = tenant ? tenant.id : 'tenant-104';

        const newTeacher = await db.user.create({
          data: {
            tenantId,
            name,
            email,
            phone: phone || '',
            password: password || 'teacher123',
            role: 'TEACHER',
            status: 'ACTIVE'
          }
        });

        return NextResponse.json({
          success: true,
          message: `Teacher ${name} created successfully!`,
          teacher: newTeacher
        });
      } catch (dbErr) {
        // Fallback for mock store response
        const newMockTeacher = {
          id: `t-${Date.now()}`,
          name,
          email,
          phone: phone || '+91 98400 00000',
          subject: subject || 'General',
          department: department || 'High School',
          assignedClasses: assignedClasses || ['Grade 10-A'],
          status: 'ACTIVE',
          geoPunchIn: { status: 'NOT_PUNCHED', time: '-', location: '-' }
        };
        mockTeachers.push(newMockTeacher);
        return NextResponse.json({
          success: true,
          message: `Teacher ${name} created successfully (Mock mode)!`,
          teacher: newMockTeacher
        });
      }
    }

    // 1a. Update Teacher Account
    if (action === 'update_teacher') {
      const { id, name, email, password, phone, subject, department, assignedClasses } = body;
      const idx = mockTeachers.findIndex(t => t.id === id);
      if (idx !== -1) {
        mockTeachers[idx] = {
          ...mockTeachers[idx],
          name: name || mockTeachers[idx].name,
          email: email || mockTeachers[idx].email,
          phone: phone !== undefined ? phone : mockTeachers[idx].phone,
          subject: subject || mockTeachers[idx].subject,
          department: department || mockTeachers[idx].department,
          assignedClasses: assignedClasses || mockTeachers[idx].assignedClasses
        };
      }
      try {
        await db.user.update({
          where: { id },
          data: { name, email, phone, password: password || undefined }
        });
      } catch (e) {
        console.log('DB update fallback to mock');
      }

      return NextResponse.json({
        success: true,
        message: `Teacher account ${name} updated successfully!`
      });
    }

    // 1b. Delete Teacher Account
    if (action === 'delete_teacher') {
      const { id } = body;
      const idx = mockTeachers.findIndex(t => t.id === id);
      if (idx !== -1) {
        mockTeachers.splice(idx, 1);
      }
      try {
        await db.user.delete({ where: { id } });
      } catch (e) {
        console.log('DB delete fallback to mock');
      }

      return NextResponse.json({
        success: true,
        message: 'Teacher account deleted successfully!'
      });
    }

    // 1b. Add New Student (Teacher Action)
    if (action === 'add_student') {
      const { name, rollNo, className, parentName, parentPhone } = body;

      if (!name || !parentPhone) {
        return NextResponse.json({ success: false, error: 'Student Name and Parent Phone are required' }, { status: 400 });
      }

      const newStudent = {
        id: `st-${Date.now()}`,
        rollNo: rollNo || `10A${Math.floor(Math.random() * 90 + 10)}`,
        name,
        class: className || 'Grade 10-A',
        parentName: parentName || 'Parent',
        parentPhone,
        attendancePercent: 100,
        overallGrade: 'A',
        totalAbsents: 0,
        attendanceStatus: 'PRESENT' as const
      };

      mockStudents.push(newStudent);

      return NextResponse.json({
        success: true,
        message: `Student ${name} added successfully to ${newStudent.class}!`,
        student: newStudent
      });
    }

    // 2. Teacher Geo Check-In (Location Verification)
    if (action === 'geo_checkin') {
      const { latitude, longitude, teacherId } = body;

      // School Target Location (e.g. Oxford Academy Campus 13.0827, 80.2707)
      const SCHOOL_LAT = 13.0827;
      const SCHOOL_LNG = 80.2707;

      // Calculate distance (Haversine formula or simple approximation)
      const latDiff = Math.abs(latitude - SCHOOL_LAT);
      const lngDiff = Math.abs(longitude - SCHOOL_LNG);
      const isWithinCampus = latDiff < 0.05 && lngDiff < 0.05; // Flexible radius for demo

      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      return NextResponse.json({
        success: true,
        isVerified: isWithinCampus,
        locationName: isWithinCampus ? 'Oxford Academy Main Campus (Geo-fenced)' : 'Outside School Boundary',
        distanceMeters: Math.round((latDiff + lngDiff) * 111000),
        punchTime: timeStr,
        message: isWithinCampus 
          ? `GPS Verified! Teacher check-in recorded at ${timeStr} inside School Zone.`
          : 'Warning: Location outside school geofence boundary. Please check in from school grounds.'
      });
    }

    // 3. Mark Student Attendance & Trigger Parent WhatsApp Alert
    if (action === 'mark_attendance') {
      const { periodNo, className, studentId, studentName, parentPhone, status, subject } = body;

      let whatsappAlertSent = false;
      let whatsappMessage = '';

      if (status === 'ABSENT' || status === 'LEAVE') {
        whatsappAlertSent = true;
        whatsappMessage = `📲 [WhatsApp Alert Sent to Parent (${parentPhone})]: Dear Parent, your child ${studentName} was marked ${status} for Period ${periodNo} (${subject}) today at Oxford Academy.`;
      }

      return NextResponse.json({
        success: true,
        message: `Attendance updated for ${studentName} (${status})`,
        whatsappAlertSent,
        whatsappMessage
      });
    }

    // 4. Update Daily Portion / Syllabus Completed
    if (action === 'update_portion') {
      const { periodNo, className, subject, portionDetails } = body;

      return NextResponse.json({
        success: true,
        message: `Portion progress logged for Period ${periodNo} (${className} - ${subject}): "${portionDetails}"`
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
