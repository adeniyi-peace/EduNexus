import { useEffect, useState } from "react";
import { Award, Download, ExternalLink, Search, FileText } from "lucide-react";
import api from "~/utils/api.client";
import type { Certificate } from "~/types/course";
import { format } from "date-fns";
import { Link } from "react-router";

export const meta = () => {
  return [
    { title: "Certificates | EduNexus" },
    { name: "description", content: "Certificates Page" },
  ];
};

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await api.get("/certificates/");
                const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                setCertificates(data);
            } catch (err) {
                console.error("Failed to fetch certificates", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCertificates();
    }, []);

    const filteredCertificates = certificates.filter(cert => 
        cert.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certificate_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownload = async (certId: string) => {
        try {
            // We use a direct link or a blob response
            const res = await api.get(`/certificates/${certId}/download/`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate_${certId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Failed to download certificate", err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">My <span className="text-primary italic">Credentials</span></h1>
                        <p className="text-sm opacity-50 font-medium font-mono uppercase tracking-widest">Verified completions & professional certificates</p>
                    </div>
                    
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search certificates..."
                            className="input input-bordered w-full pl-12 rounded-2xl bg-base-100/50 border-base-content/10 focus:border-primary/50 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {filteredCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCertificates.map((cert) => (
                            <div 
                                key={cert.id} 
                                className="group bg-base-100 border border-base-content/5 rounded-[2.5rem] p-8 hover:border-primary/30 transition-all duration-500 relative overflow-hidden shadow-xl shadow-base-content/5"
                            >
                                {/* Background Decorative Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                                
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-lg">
                                            <Award size={28} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-1">Issued On</p>
                                            <p className="text-xs font-bold">{format(new Date(cert.issued_at), 'MMM dd, yyyy')}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-black leading-tight mb-2 group-hover:text-primary transition-colors">{cert.course_name}</h3>
                                        <p className="text-sm opacity-60 font-medium mb-6">Instructor: <span className="text-base-content">{cert.instructor_name}</span></p>
                                        
                                        <div className="bg-base-200/50 rounded-2xl p-4 border border-base-content/5 mb-8">
                                            <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] mb-2">Credential ID</p>
                                            <p className="text-xs font-mono font-bold text-primary truncate">{cert.certificate_id}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleDownload(cert.id)}
                                            className="btn btn-primary rounded-2xl flex-1 h-12 font-black text-xs gap-2 group/btn"
                                        >
                                            <Download size={16} className="group-hover/btn:translate-y-0.5 transition-transform" />
                                            Generate & Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
                        <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
                            <FileText size={40} />
                        </div>
                        <h3 className="text-2xl font-black mb-2">No certificates found</h3>
                        <p className="text-sm max-w-xs mx-auto">Complete courses with 100% progress to unlock your official verified credentials.</p>
                        <Link to="/dashboard/courses" className="btn btn-primary btn-sm rounded-xl mt-8 font-black">Browse Courses</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
