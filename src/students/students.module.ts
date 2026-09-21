import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamResult } from '../exams/exam-result.entity';
import { LessonAttendance } from '../lessons/lesson-attendance.entity';
import { Lesson } from '../lessons/lesson.entity';
import { Student } from './student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Lesson, LessonAttendance, ExamResult]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
