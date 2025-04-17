export interface Mark {
  _id: string;
  studentId: string;
 // Optional student details when populated
 student?: {
  LastName?: string;
  FirstName?: string;
};
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  month: string;
  year: number;
  teacherComments?: string;
}



// Ensure this file exists and contains the following export

export interface InsertMarkData {

  studentId: string;

  subjectName: string;

  marksObtained: number;

  maxMarks?: number;

  month: string;

  year: number;

  teacherComments?: string;

}
