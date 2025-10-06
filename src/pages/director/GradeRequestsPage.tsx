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
import { API_BASE_URL } from "@/config/api";
import "@/styles/GradeRequestsPage.css";

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
      pending: "status-badge-pending",
      approved: "status-badge-approved",
      rejected: "status-badge-rejected",
    };
    
    const labels = {
      pending: "Kutilmoqda",
      approved: "Tasdiqlangan",
      rejected: "Rad etilgan",
    };

    const icons = {
      pending: <Clock className="status-icon" />,
      approved: <CheckCircle className="status-icon" />,
      rejected: <X className="status-icon" />,
    };

    return (
      <Badge className={`status-badge ${colors[status as keyof typeof colors]}`}>
        <span className="status-badge-content">
          {icons[status as keyof typeof icons]}
          {labels[status as keyof typeof labels]}
        </span>
      </Badge>
    );
  };

  const getGradeChange = (current: number, requested: number) => {
    const isIncrease = requested > current;
    const color = isIncrease ? "grade-increase" : "grade-decrease";
    const arrow = isIncrease ? "↗" : "↘";
    
    return (
      <span className={`grade-change ${color}`}>
        {current} {arrow} {requested}
      </span>
    );
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === "all" || request.status === statusFilter
  );

  if (loading) {
    return (
      <div className="requests-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-page">
      <div className="requests-header">
        <div>
          <h1 className="requests-title">Baho o'zgartirish so'rovlari</h1>
          <p className="requests-subtitle">O'qituvchilardan kelgan baho o'zgartirish so'rovlarini ko'rib chiqing</p>
        </div>
      </div>

      {/* Filter by status */}
      <Card className="requests-filter">
        <CardContent className="filter-content">
          <div className="filter-content">
            <Label htmlFor="statusFilter" className="filter-label">Holat bo'yicha filtr:</Label>
            <div className="filter-buttons">
              <Button 
                variant={statusFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("all")}
                className="filter-btn"
              >
                Barchasi
              </Button>
              <Button 
                variant={statusFilter === "pending" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("pending")}
                className="filter-btn"
              >
                <Clock className="filter-icon" />
                Kutilmoqda
              </Button>
              <Button 
                variant={statusFilter === "approved" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("approved")}
                className="filter-btn"
              >
                <CheckCircle className="filter-icon" />
                Tasdiqlangan
              </Button>
              <Button 
                variant={statusFilter === "rejected" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("rejected")}
                className="filter-btn"
              >
                <X className="filter-icon" />
                Rad etilgan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="requests-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami so'rovlar</CardTitle>
            <AlertCircle className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">{requests.length}</div>
            <p className="stat-card-description">
              Barcha vaqt davomida
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Kutilmoqda</CardTitle>
            <Clock className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-pending">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <p className="stat-card-description">
              Ko'rib chiqish kerak
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Tasdiqlangan</CardTitle>
            <CheckCircle className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-approved">
              {requests.filter(r => r.status === 'approved').length}
            </div>
            <p className="stat-card-description">
              Muvaffaqiyatli tasdiqlangan
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Rad etilgan</CardTitle>
            <X className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-rejected">
              {requests.filter(r => r.status === 'rejected').length}
            </div>
            <p className="stat-card-description">
              Rad etilgan so'rovlar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="requests-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Baho o'zgartirish so'rovlari</CardTitle>
          <CardDescription className="table-card-description">
            {filteredRequests.length} ta so'rov topildi
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="requests-table">
            <TableHeader className="table-header">
              <TableRow className="table-header-row">
                <TableHead className="table-header-cell">#</TableHead>
                <TableHead className="table-header-cell">O'quvchi</TableHead>
                <TableHead className="table-header-cell">Sinf</TableHead>
                <TableHead className="table-header-cell">Fan</TableHead>
                <TableHead className="table-header-cell">O'qituvchi</TableHead>
                <TableHead className="table-header-cell">Baho o'zgarishi</TableHead>
                <TableHead className="table-header-cell">Sana</TableHead>
                <TableHead className="table-header-cell">Holat</TableHead>
                <TableHead className="table-header-cell text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-body">
              {filteredRequests
                .sort((a, b) => {
                  if (a.status === 'pending' && b.status !== 'pending') return -1;
                  if (a.status !== 'pending' && b.status === 'pending') return 1;
                  return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
                })
                .map((request, index) => (
                <TableRow key={request.id} className="table-row">
                  <TableCell className="table-cell font-medium">{index + 1}</TableCell>
                  <TableCell className="table-cell font-medium">{request.studentName}</TableCell>
                  <TableCell className="table-cell">{request.className}</TableCell>
                  <TableCell className="table-cell">
                    <Badge variant="outline" className="subject-badge">{request.subjectName}</Badge>
                  </TableCell>
                  <TableCell className="table-cell">{request.teacherName}</TableCell>
                  <TableCell className="table-cell">{getGradeChange(request.currentGrade, request.requestedGrade)}</TableCell>
                  <TableCell className="table-cell">{new Date(request.requestDate).toLocaleDateString('uz-UZ')}</TableCell>
                  <TableCell className="table-cell">{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="actions-container">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewDialog(request)}
                        className="action-button action-button-sm"
                      >
                        <Eye className="action-icon" />
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
                            className="action-button action-button-sm action-approve"
                          >
                            <Check className="action-icon" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsDialogOpen(true);
                            }}
                            className="action-button action-button-sm action-reject"
                          >
                            <X className="action-icon" />
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
        <DialogContent className="review-dialog">
          <DialogHeader>
            <DialogTitle className="dialog-title">
              So'rovni ko'rib chiqish
            </DialogTitle>
            <DialogDescription className="dialog-description">
              {selectedRequest && (
                <div className="request-info">
                  <div className="info-item"><strong>O'quvchi:</strong> {selectedRequest.studentName} ({selectedRequest.className})</div>
                  <div className="info-item"><strong>Fan:</strong> {selectedRequest.subjectName}</div>
                  <div className="info-item"><strong>O'qituvchi:</strong> {selectedRequest.teacherName}</div>
                  <div className="info-item"><strong>Baho o'zgarishi:</strong> {getGradeChange(selectedRequest.currentGrade, selectedRequest.requestedGrade)}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="dialog-form">
              <div className="form-section">
                <Label htmlFor="reason" className="form-label">O'qituvchi sababi:</Label>
                <div className="reason-text">
                  {selectedRequest.reason}
                </div>
              </div>

              <div className="form-section">
                <Label htmlFor="reviewNote" className="form-label">Direktor izohi:</Label>
                <Textarea
                  id="reviewNote"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="So'rov haqida izoh yozing..."
                  className="review-textarea"
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter className="dialog-footer">
            {selectedRequest?.status === 'pending' ? (
              <div className="action-buttons">
                <Button
                  onClick={() => selectedRequest && handleReject(selectedRequest.id)}
                  variant="outline"
                  className="btn btn-reject"
                >
                  <X className="btn-icon" />
                  Rad etish
                </Button>
                <Button
                  onClick={() => selectedRequest && handleApprove(selectedRequest.id)}
                  className="btn btn-approve"
                >
                  <Check className="btn-icon" />
                  Tasdiqlash
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsDialogOpen(false)} className="btn btn-primary">
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