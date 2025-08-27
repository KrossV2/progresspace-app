import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Eye, AlertCircle, Clock, CheckCircle } from "lucide-react";
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

  // TODO: Replace with actual API URL
  const API_BASE_URL = "http://localhost:5000"; // Change this to your backend URL

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // const response = await fetch(`${API_BASE_URL}/api/director/grade-requests`);
      // const data = await response.json();
      // setRequests(data);
      
      // Mock data for now
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
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/director/grade-requests/${id}/approve`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reviewNote }),
      // });
      
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
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/director/grade-requests/${id}/reject`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reviewNote }),
      // });
      
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
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    
    const labels = {
      pending: "Kutilmoqda",
      approved: "Tasdiqlangan",
      rejected: "Rad etilgan",
    };

    const icons = {
      pending: <Clock className="h-3 w-3" />,
      approved: <CheckCircle className="h-3 w-3" />,
      rejected: <X className="h-3 w-3" />,
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        <span className="flex items-center gap-1">
          {icons[status as keyof typeof icons]}
          {labels[status as keyof typeof labels]}
        </span>
      </Badge>
    );
  };

  const getGradeChange = (current: number, requested: number) => {
    const isIncrease = requested > current;
    const color = isIncrease ? "text-green-600" : "text-red-600";
    const arrow = isIncrease ? "↗" : "↘";
    
    return (
      <span className={`font-medium ${color}`}>
        {current} {arrow} {requested}
      </span>
    );
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === "all" || request.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Baho o'zgartirish so'rovlari</h1>
          <p className="text-muted-foreground">O'qituvchilardan kelgan baho o'zgartirish so'rovlarini ko'rib chiqing</p>
        </div>
      </div>

      {/* Filter by status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <Label htmlFor="statusFilter">Holat bo'yicha filtr:</Label>
            <div className="flex gap-2">
              <Button 
                variant={statusFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                Barchasi
              </Button>
              <Button 
                variant={statusFilter === "pending" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                <Clock className="h-4 w-4 mr-1" />
                Kutilmoqda
              </Button>
              <Button 
                variant={statusFilter === "approved" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("approved")}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Tasdiqlangan
              </Button>
              <Button 
                variant={statusFilter === "rejected" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("rejected")}
              >
                <X className="h-4 w-4 mr-1" />
                Rad etilgan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami so'rovlar</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              Barcha vaqt davomida
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kutilmoqda</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ko'rib chiqish kerak
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasdiqlangan</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Muvaffaqiyatli tasdiqlangan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rad etilgan</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {requests.filter(r => r.status === 'rejected').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Rad etilgan so'rovlar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Baho o'zgartirish so'rovlari</CardTitle>
          <CardDescription>
            {filteredRequests.length} ta so'rov topildi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>O'quvchi</TableHead>
                <TableHead>Sinf</TableHead>
                <TableHead>Fan</TableHead>
                <TableHead>O'qituvchi</TableHead>
                <TableHead>Baho o'zgarishi</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
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
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{request.studentName}</TableCell>
                  <TableCell>{request.className}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.subjectName}</Badge>
                  </TableCell>
                  <TableCell>{request.teacherName}</TableCell>
                  <TableCell>{getGradeChange(request.currentGrade, request.requestedGrade)}</TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString('uz-UZ')}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewDialog(request)}
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
                            className="text-green-600 hover:text-green-800"
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
                            className="text-red-600 hover:text-red-800"
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              So'rovni ko'rib chiqish
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <div className="space-y-2 text-sm">
                  <div><strong>O'quvchi:</strong> {selectedRequest.studentName} ({selectedRequest.className})</div>
                  <div><strong>Fan:</strong> {selectedRequest.subjectName}</div>
                  <div><strong>O'qituvchi:</strong> {selectedRequest.teacherName}</div>
                  <div><strong>Baho o'zgarishi:</strong> {getGradeChange(selectedRequest.currentGrade, selectedRequest.requestedGrade)}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">O'qituvchi sababi:</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {selectedRequest.reason}
                </div>
              </div>

              <div>
                <Label htmlFor="reviewNote">Direktor izohi:</Label>
                <Textarea
                  id="reviewNote"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="So'rov haqida izoh yozing..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedRequest?.status === 'pending' ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => selectedRequest && handleReject(selectedRequest.id)}
                  variant="outline"
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rad etish
                </Button>
                <Button
                  onClick={() => selectedRequest && handleApprove(selectedRequest.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Tasdiqlash
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsDialogOpen(false)}>
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