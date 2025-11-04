import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Eye, AlertCircle, Clock, CheckCircle, User, BookOpen, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GradeChangeRequest {
  id: number;
  studentName: string;
  className: string;
  subjectName: string;
  teacherName: string;
  currentGrade: number;
  requestedGrade: number;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

const GradeRequestsPage = () => {
  const [requests, setRequests] = useState<GradeChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<GradeChangeRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setRequests([
        {
          id: 1,
          studentName: "Aziz Karimov",
          className: "10-A",
          subjectName: "Matematika",
          teacherName: "Nilufar Karimova",
          currentGrade: 3,
          requestedGrade: 4,
          reason: "O'quvchi qo'shimcha mashqlar bajarib, bilimini yaxshiladi",
          requestDate: "2024-01-15",
          status: "pending"
        },
        {
          id: 2,
          studentName: "Malika Tosheva",
          className: "9-B",
          subjectName: "Fizika",
          teacherName: "Bekzod Tursunov",
          currentGrade: 2,
          requestedGrade: 3,
          reason: "Nazorat ishida xatolik bor edi",
          requestDate: "2024-01-14",
          status: "pending"
        },
        {
          id: 3,
          studentName: "Sardor Ahmadov",
          className: "8-A",
          subjectName: "Ona tili",
          teacherName: "Sevara Norova",
          currentGrade: 4,
          requestedGrade: 5,
          reason: "O'quvchi ustama ish bajarib, yuqori natija ko'rsatdi",
          requestDate: "2024-01-13",
          status: "approved",
          reviewNote: "O'qituvchi tavsiyasi asosida tasdiqlandi"
        },
        {
          id: 4,
          studentName: "Nigora Ibragimova",
          className: "7-B",
          subjectName: "Ingliz tili",
          teacherName: "Davron Umarov",
          currentGrade: 5,
          requestedGrade: 4,
          reason: "Bahoni tushirish so'rovi",
          requestDate: "2024-01-12",
          status: "rejected",
          reviewNote: "Yetarli asoslar yo'q"
        },
      ]);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "So'rovlar ro'yxatini yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setRequests(requests.map(request => 
        request.id === id 
          ? { ...request, status: 'approved' as const, reviewNote }
          : request
      ));
      
      toast({
        title: "Muvaffaqiyat",
        description: "So'rov tasdiqlandi",
      });

      setIsDialogOpen(false);
      setReviewNote("");
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "So'rovni tasdiqlashda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      setRequests(requests.map(request => 
        request.id === id 
          ? { ...request, status: 'rejected' as const, reviewNote }
          : request
      ));
      
      toast({
        title: "Muvaffaqiyat",
        description: "So'rov rad etildi",
      });

      setIsDialogOpen(false);
      setReviewNote("");
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "So'rovni rad etishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const openReviewDialog = (request: GradeChangeRequest) => {
    setSelectedRequest(request);
    setReviewNote(request.reviewNote || "");
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    
    const labels = {
      pending: "Kutilmoqda",
      approved: "Tasdiqlangan",
      rejected: "Rad etilgan",
    };

    const icons = {
      pending: <Clock className="h-3 w-3 mr-1" />,
      approved: <CheckCircle className="h-3 w-3 mr-1" />,
      rejected: <X className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge className={`font-semibold px-3 py-1 rounded-full border ${colors[status as keyof typeof colors]}`}>
        <span className="flex items-center">
          {icons[status as keyof typeof icons]}
          {labels[status as keyof typeof labels]}
        </span>
      </Badge>
    );
  };

  const getGradeChange = (current: number, requested: number) => {
    const isIncrease = requested > current;
    const color = isIncrease ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
    const arrow = isIncrease ? "↗" : "↘";
    
    return (
      <span className={`font-bold px-2 py-1 rounded-lg ${color}`}>
        {current} {arrow} {requested}
      </span>
    );
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === "all" || request.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Baho o'zgartirish so'rovlari
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              O'qituvchilardan kelgan baho o'zgartirish so'rovlarini ko'rib chiqing
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami so'rovlar
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {requests.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha vaqt davomida
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Kutilmoqda
            </CardTitle>
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Ko'rib chiqish kerak
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tasdiqlangan
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {requests.filter(r => r.status === 'approved').length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Muvaffaqiyatli tasdiqlangan
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Rad etilgan
            </CardTitle>
            <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
              {requests.filter(r => r.status === 'rejected').length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Rad etilgan so'rovlar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter by status */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Filtrlash
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-2">
            Holat bo'yicha so'rovlarni filtrlash
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={statusFilter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="rounded-xl transition-all duration-200"
            >
              Barchasi
            </Button>
            <Button 
              variant={statusFilter === "pending" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("pending")}
              className="rounded-xl transition-all duration-200"
            >
              <Clock className="h-4 w-4 mr-2" />
              Kutilmoqda
            </Button>
            <Button 
              variant={statusFilter === "approved" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("approved")}
              className="rounded-xl transition-all duration-200"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Tasdiqlangan
            </Button>
            <Button 
              variant={statusFilter === "rejected" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("rejected")}
              className="rounded-xl transition-all duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Rad etilgan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Baho o'zgartirish so'rovlari
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-2">
            {filteredRequests.length} ta so'rov topildi
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">O'quvchi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Sinf</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Fan</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">O'qituvchi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Baho o'zgarishi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Sana</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests
                .sort((a, b) => {
                  if (a.status === 'pending' && b.status !== 'pending') return -1;
                  if (a.status !== 'pending' && b.status === 'pending') return 1;
                  return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
                })
                .map((request, index) => (
                <TableRow key={request.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {request.studentName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 font-semibold">
                      {request.className}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {request.subjectName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {request.teacherName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {getGradeChange(request.currentGrade, request.requestedGrade)}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600 dark:text-gray-400">
                    {new Date(request.requestDate).toLocaleDateString('uz-UZ')}
                  </TableCell>
                  <TableCell className="py-4">
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewDialog(request)}
                        className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              handleApprove(request.id);
                            }}
                            className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 h-10 w-10 p-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsDialogOpen(true);
                            }}
                            className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-10 w-10 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              So'rovni ko'rib chiqish
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              {selectedRequest && (
                <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <strong className="text-gray-700 dark:text-gray-300">O'quvchi:</strong>
                    <span className="text-gray-600 dark:text-gray-400">{selectedRequest.studentName} ({selectedRequest.className})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <strong className="text-gray-700 dark:text-gray-300">Fan:</strong>
                    <span className="text-gray-600 dark:text-gray-400">{selectedRequest.subjectName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-purple-500" />
                    <strong className="text-gray-700 dark:text-gray-300">O'qituvchi:</strong>
                    <span className="text-gray-600 dark:text-gray-400">{selectedRequest.teacherName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-700 dark:text-gray-300">Baho o'zgarishi:</strong>
                    {getGradeChange(selectedRequest.currentGrade, selectedRequest.requestedGrade)}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6 my-6">
              <div className="space-y-3">
                <Label htmlFor="reason" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  O'qituvchi sababi:
                </Label>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  {selectedRequest.reason}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="reviewNote" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Direktor izohi:
                </Label>
                <Textarea
                  id="reviewNote"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="So'rov haqida izoh yozing..."
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3">
            {selectedRequest?.status === 'pending' ? (
              <>
                <Button
                  onClick={() => selectedRequest && handleReject(selectedRequest.id)}
                  variant="outline"
                  className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 flex-1"
                >
                  <X className="h-5 w-5 mr-2" />
                  Rad etish
                </Button>
                <Button
                  onClick={() => selectedRequest && handleApprove(selectedRequest.id)}
                  className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-1"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Tasdiqlash
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full"
              >
                Yopish
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradeRequestsPage;