import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiRefreshCw, FiCopy } from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { TransactionDetail } from "../../../features/transactionDetail/transactionDetail";
import { getTransactionDetail } from "../../../features/transactionDetail/services/transactionDetailService";
import type { TransactionFullDetail } from "../../../features/transactionDetail/transactionFullDetail";
import { getTransactionFullDetail } from "../../../features/transactionDetail/services/transactionFullDetailService";
import { cancelTransaction } from "../../../features/transactionDetail/services/transactionDetailService";

//Status Payment
import unpaidImg from "../../../assets/img/payment-status/unpaid.png";
import paidImg from "../../../assets/img/payment-status/paid.png";
import expiredImg from "../../../assets/img/payment-status/expired.png";
import canceledImg from "../../../assets/img/payment-status/canceled.png";
import failedImg from "../../../assets/img/payment-status/failed.png";

//Payment Logo
import BniVaLogo from "../../../../public/images/payments/bni.png";
import BrivaLogo from "../../../../public/images/payments/bri.png";
import MandiriLogo from "../../../../public/images/payments/mandiri.png";
import BcaLogo from "../../../../public/images/payments/bca.png";
import QrisLogo from "../../../../public/images/payments/qris.jpg";
import DanaLogo from "../../../../public/images/payments/dana.jpg";
import ShopeePayLogo from "../../../../public/images/payments/shopeepay.jpg";
import IndomaretLogo from "../../../../public/images/payments/indomaret.jpg";
import AlfamaretLogo from "../../../../public/images/payments/alfamart.jpg";

const MySwal = withReactContent(Swal);

const getPaymentLogo = (name: string) => {
    if (name.includes("BNI")) return BniVaLogo;
    if (name.includes("BRI")) return BrivaLogo;
    if (name.includes("Mandiri")) return MandiriLogo;
    if (name.includes("BCA")) return BcaLogo;
    if (name.includes("QRIS")) return QrisLogo;
    if (name.includes("DANA")) return DanaLogo;
    if (name.includes("ShopeePay")) return ShopeePayLogo;
    if (name.includes("Indomaret")) return IndomaretLogo;
    if (name.includes("Alfamart")) return AlfamaretLogo;
    return undefined;
};

const statusConfig: Record<
    "UNPAID" | "PAID" | "EXPIRED" | "CANCELLED" | "FAILED",
    { img: string; title?: string; message?: string }
> = {
    UNPAID: {
        img: unpaidImg,
        title: "Belum Terbayar",
        message: "Silakan menyelesaikan pembayaran",
    },
    PAID: {
        img: paidImg,
        title: "Pembayaran Berhasil",
        message: "Terima kasih, pembayaran Anda telah berhasil",
    },
    EXPIRED: {
        img: expiredImg,
        title: "Transaksi Kadaluarsa",
        message: "Mohon maaf transaksi Anda telah kadaluarsa",
    },
    CANCELLED: {
        img: canceledImg,
        title: "Pembayaran Dibatalkan",
        message: "Transaksi Anda berhasil dibatalkan",
    },
    FAILED: {
        img: failedImg,
        title: "Transaksi Dibatalkan",
        message: "Transaksi Anda telah dibatalkan",
    },
};

const getFailedTransaction = (ref: string) => {
    const saved = localStorage.getItem(`failed_${ref}`);
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
};

const TransactionDetailPage: React.FC = () => {
    const { reference } = useParams<{ reference: string }>();
    const navigate = useNavigate();
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
    const [fullTransaction, setFullTransaction] = useState<TransactionFullDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<"UNPAID" | "PAID" | "EXPIRED" | "CANCELLED" | "FAILED" | null>(null);
    const [openSection, setOpenSection] = useState<string | null>(null);

    useEffect(() => {
        if (reference) {
            setIsLoading(true);
            Promise.all([getTransactionDetail(reference), getTransactionFullDetail(reference)])
                .then(([statusRes, fullRes]) => {
                    setTransaction(statusRes);
                    setFullTransaction(fullRes);

                    const failed = getFailedTransaction(reference);
                    if (failed?.status === "FAILED") {
                        setPaymentStatus("FAILED");
                    } else {
                        setPaymentStatus(statusRes.status as "UNPAID" | "PAID" | "EXPIRED" | "CANCELLED");
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [reference]);

    const displayTransaction =
        paymentStatus === "FAILED" && reference
            ? getFailedTransaction(reference) || transaction
            : transaction;

    const logo = displayTransaction?.payment_name ? getPaymentLogo(displayTransaction.payment_name) : undefined;

    const handleCheckStatus = async () => {
        if (!reference) return;
        setIsLoading(true);
        try {
            const [statusRes, fullRes] = await Promise.all([
                getTransactionDetail(reference),
                getTransactionFullDetail(reference),
            ]);

            const failed = getFailedTransaction(reference);
            if (failed?.status === "FAILED") {
                setPaymentStatus("FAILED");
            } else {
                setPaymentStatus(statusRes.status as "UNPAID" | "PAID" | "EXPIRED" | "CANCELLED");
            }

            setTransaction(statusRes);
            setFullTransaction(fullRes);
        } catch (error) {
            console.error("Gagal cek status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelPayment = async () => {
        if (!reference) return;

        const result = await MySwal.fire({
            title: "Batalkan Pembayaran?",
            text: "Apakah Anda yakin ingin membatalkan transaksi ini?",
            icon: "warning",
            width: "420px",
            showCancelButton: true,
            confirmButtonText: "Ya, Batalkan",
            cancelButtonText: "Tidak",
            buttonsStyling: false,
            customClass: {
                popup: "my-swal-popup",
                title: "my-swal-title",
                icon: "my-swal-icon",
                htmlContainer: "my-swal-text",
                confirmButton: "my-swal-confirm",
                cancelButton: "my-swal-cancel",
            },
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);
        try {
            const res = await cancelTransaction(reference);

            if (res?.message?.toLowerCase().includes("dibatalkan")) {
                setPaymentStatus("CANCELLED");
                const failedData = {
                    status: "FAILED",
                    voucher: displayTransaction?.voucher || "Rp 0",
                    amount_received: displayTransaction?.amount_received || 0,
                    amount: displayTransaction?.amount || 0,
                    payment_name: displayTransaction?.payment_name || "-",
                    course: displayTransaction?.course || {},
                };
                localStorage.setItem(`failed_${reference}`, JSON.stringify(failedData));
            }

            await MySwal.fire({
                title: "Berhasil!",
                text: res.message || "Transaksi berhasil dibatalkan.",
                icon: "success",
                width: "420px",
                confirmButtonText: "OK",
                buttonsStyling: false,
                customClass: {
                    popup: "my-swal-popup",
                    title: "my-swal-title",
                    icon: "my-swal-icon",
                    htmlContainer: "my-swal-text",
                    confirmButton: "my-swal-confirm",
                },
            });
        } catch (error) {
            console.error("Gagal membatalkan transaksi:", error);
            MySwal.fire({
                title: "Gagal!",
                text: "Terjadi kesalahan saat membatalkan transaksi.",
                icon: "error",
                width: "420px",
                confirmButtonText: "OK",
                buttonsStyling: false,
                customClass: {
                    popup: "my-swal-popup",
                    title: "my-swal-title",
                    icon: "my-swal-icon",
                    htmlContainer: "my-swal-text",
                    confirmButton: "my-swal-confirm",
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedText(text);
            setTimeout(() => setCopiedText(null), 1200);
        });
    };

    const handleBack = () => {
        navigate('/dashboard/user/transaction');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-8 md:px-26 lg:px-29 xl:px-29 2xl:px-34 animate-pulse">
                <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Skeleton detail transaction */}
                    <div className="col-span-2 bg-white border border-gray-300 rounded-md shadow-md p-3 space-y-4">
                        <div className="h-5 bg-gray-300 rounded w-1/3"></div>

                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>

                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>

                        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>

                        <div className="h-10 bg-gray-300 rounded w-2/3 mx-auto"></div>
                    </div>

                    {/* Skeleton */}
                    <div className="col-span-2 lg:col-span-1 space-y-6">

                        {/* Skeleton Status */}
                        <div className="bg-white border border-gray-300 rounded-md shadow-md p-3 space-y-3">
                            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-28 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
                            <div className="h-8 bg-gray-300 rounded w-2/3 mx-auto"></div>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-md shadow-md p-3 space-y-3">
                            <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                            <div className="h-8 bg-gray-300 rounded w-full"></div>
                            <div className="h-8 bg-gray-300 rounded w-full"></div>
                            <div className="h-8 bg-gray-300 rounded w-full"></div>
                        </div>

                        <div className="flex justify-center">
                            <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-8 md:px-26 lg:px-29 xl:px-29 2xl:px-34">
            <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2 bg-white border border-gray-300 rounded-md shadow-md p-3">
                    <h2 className="text-left text-sm md:text-md font-semibold text-gray-800 mb-4">
                        Rincian Pembayaran
                    </h2>

                    <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] md:text-sm text-gray-600">Produk yang dibeli</p>
                        </div>
                        <h3 className="flex justify-between items-center text-[9px] md:text-lg font-semibold text-gray-600">
                            <p>{fullTransaction?.course?.title}</p>
                            <span className="text-purple-600 font-semibold text-xs md:text-md">
                                <p>
                                    Rp {displayTransaction?.amount_received ? displayTransaction.amount_received.toLocaleString("id-ID") : "0"}
                                </p>
                            </span>
                        </h3>
                    </div>

                    <div className="flex justify-between items-center py-3 border-t border-gray-200">
                        <p className="text-[10px] md:text-sm text-gray-600">
                            Voucher Diskon
                        </p>
                        <h3 className="text-xs md:text-sm font-medium text-purple-600">
                            - {displayTransaction?.voucher || "Rp 0"}
                        </h3>
                    </div>

                    <div className="flex justify-between py-3 border-t border-b border-gray-200">
                        <p className="mt-1 text-[10px] md:text-sm text-gray-600">Total Pembayaran</p>
                        <h3 className="text-sm md:text-lg font-bold text-purple-600">
                            <p>
                                Rp {displayTransaction?.amount ? Number(displayTransaction.amount).toLocaleString("id-ID") : "0"}
                            </p>
                        </h3>
                    </div>

                    <div className="mb-4 border-b">
                        <div className="flex justify-between items-center">
                            <p className="text-left text-[10px] md:text-sm text-gray-600 mb-2">Metode Pembayaran</p>
                            <div className="flex items-center mb-2">
                                {logo && (
                                    <img
                                        src={logo}
                                        alt={displayTransaction?.payment_name}
                                        className="max-h-10 md:max-h-13 lg:max-h-16 xl:max-h-18 2xl:max-h-19 object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {displayTransaction?.pay_code && (
                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <p className="text-left text-[10px] md:text-sm text-gray-600">
                                    Kode Pembayaran (1 × 24 Jam)
                                </p>
                                <div className="flex items-center gap-2 relative">
                                    <p className="text-xs md:text-xl font-mono text-purple-600 font-bold">
                                        {displayTransaction.pay_code}
                                    </p>
                                    <button
                                        onClick={() =>
                                            (displayTransaction?.pay_code) && handleCopy(displayTransaction.pay_code)
                                        }
                                        className="p-0.5 md:p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                                    >
                                        <FiCopy />
                                    </button>
                                    {copiedText === displayTransaction?.pay_code && (
                                        <span
                                            className="absolute top-[-25px] right-0 bg-gray-100 text-black text-[10px] md:text-xs px-2 py-1 rounded-md"
                                        >
                                            Berhasil disalin!
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] md:text-sm text-gray-600">Kode Transaksi</p>
                            <p className="text-xs md:text-sm font-mono text-gray-600">{transaction?.reference}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] md:text-sm text-gray-600">Bayar Sebelum</p>
                            <p className="text-[10px] md:text-sm font-semibold text-gray-600">
                                {transaction?.expired_time
                                    ? (() => {
                                        const date = new Date(transaction.expired_time * 1000);
                                        const day = date.getDate();
                                        const month = date.toLocaleString("id-ID", { month: "long" });
                                        const year = date.getFullYear();
                                        const hours = String(date.getHours()).padStart(2, "0");
                                        const minutes = String(date.getMinutes()).padStart(2, "0");
                                        return `${day} ${month} ${year} - ${hours}:${minutes}`;
                                    })()
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2 lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-md shadow-md p-3 border border-gray-300">
                        <h2 className="text-left text-sm md:text-md font-semibold text-gray-800 mb-4">
                            Status Pembayaran
                        </h2>
                        <div className="flex flex-col items-center text-center">
                            {paymentStatus && transaction?.payment_name?.includes("QRIS") ? (
                                <>
                                    {/* UNPAID dengan QR Code */}
                                    {paymentStatus === "UNPAID" && (
                                        <div className="flex flex-col items-center text-center">
                                            <QRCodeCanvas
                                                value={transaction?.pay_code || transaction?.checkout_url || ""}
                                                size={200}
                                                includeMargin={true}
                                            />

                                            {/* Title & Message */}
                                            <h3 className="text-sm md:text-md font-bold text-black">
                                                QR Code Pembayaran
                                            </h3>
                                            <p className="text-[10px] md:text-xs text-[#9425FE] mt-1 mb-3">
                                                Menunggu pembayaran
                                            </p>

                                            <button
                                                onClick={() => {
                                                    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
                                                    const url = canvas.toDataURL("image/png");
                                                    const link = document.createElement("a");
                                                    link.href = url;
                                                    link.download = "qris.png";
                                                    link.click();
                                                }}
                                                className="mt-2 group bg-white text-[#9425FE] text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-md 
                                                font-semibold py-3 md:py-3 lg:py-3 xl:py-3 2xl:py-4 w-[310px] md:w-[160px] lg:w-[280px] xl:w-[310px] 2xl:w-[390px]
                                                rounded-md flex items-center justify-center mx-auto md:mx-0 gap-2
                                                transition-all duration-500 ease-in-out
                                                border border-[#9425FE] hover:text-yellow-500 
                                                active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                                                focus:outline-none cursor-pointer"
                                            >
                                                Unduh Kode QR
                                            </button>
                                        </div>
                                    )}

                                    {/* PAID & EXPIRED */}
                                    {paymentStatus !== "UNPAID" && (
                                        <div className="flex flex-col items-center text-center mt-3">
                                            <img
                                                src={statusConfig[paymentStatus].img}
                                                alt="Payment Status"
                                                className="h-40 mb-2"
                                            />

                                            <h3 className="text-sm md:text-md font-bold text-black mt-3">
                                                {statusConfig[paymentStatus].title}
                                            </h3>
                                            {statusConfig[paymentStatus].message && (
                                                <p className="text-[10px] md:text-xs mt-1 mb-3 text-[#9425FE]">
                                                    {statusConfig[paymentStatus].message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Except QRIS
                                paymentStatus && (
                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={statusConfig[paymentStatus].img}
                                            alt="Payment Status"
                                            className="h-40 object-contain mb-2"
                                        />

                                        <h3 className="text-sm md:text-md font-bold text-black mt-3">
                                            {statusConfig[paymentStatus].title}
                                        </h3>
                                        {statusConfig[paymentStatus].message && (
                                            <p className="text-[10px] md:text-xs mt-1 mb-3 text-[#9425FE]">
                                                {statusConfig[paymentStatus].message}
                                            </p>
                                        )}
                                    </div>
                                )
                            )}
                            {paymentStatus !== "FAILED" && (
                                <button
                                    onClick={handleCheckStatus}
                                    className="mt-2 group bg-white text-[#9425FE] text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-md 
                                                font-semibold py-3 md:py-3 lg:py-3 xl:py-3 2xl:py-4 w-[310px] md:w-[160px] lg:w-[280px] xl:w-[310px] 2xl:w-[390px]
                                                rounded-md flex items-center justify-center mx-auto md:mx-0 gap-2
                                                transition-all duration-500 ease-in-out
                                                border border-[#9425FE] hover:text-yellow-400 
                                                active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                                                focus:outline-none cursor-pointer"
                                >
                                    <span className="flex items-center gap-2 transition-colors duration-500 group-hover:text-yellow-400">
                                        <FiRefreshCw />
                                        Cek Status
                                    </span>
                                </button>
                            )}
                            {paymentStatus === "UNPAID" && (
                                <button
                                    onClick={handleCancelPayment}
                                    className="mt-2 group bg-[#9425FE] text-white text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-md 
                                    font-semibold py-3 md:py-3 lg:py-3 xl:py-3 2xl:py-4 w-[310px] md:w-[160px] lg:w-[280px] xl:w-[310px] 2xl:w-[390px]
                                    rounded-md flex items-center justify-center mx-auto md:mx-0 gap-2
                                    transition-all duration-500 ease-in-out
                                    shadow-[4px_4px_0_#0A0082] 
                                    hover:bg-yellow-400 hover:text-[#0A0082] hover:shadow-none
                                    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                                    focus:outline-none cursor-pointer"
                                >
                                    Batalkan Pembayaran
                                </button>
                            )}
                        </div>
                    </div>

                    {paymentStatus !== "FAILED" && (
                        <div className="bg-white rounded-md shadow-md p-3 border border-gray-300">
                            <h2 className="text-left text-sm md:text-md font-semibold text-gray-800 mb-4">
                                Instruksi Pembayaran
                            </h2>
                            <div className="flex flex-col gap-2">
                                {transaction?.instructions?.map((instruksi, idx) => (
                                    <div key={idx}>
                                        <button
                                            onClick={() =>
                                                setOpenSection(openSection === instruksi.title ? null : instruksi.title)
                                            }
                                            className={`w-full flex justify-between items-center px-3 py-2 text-left font-medium text-xs md:text-sm transition ${openSection === instruksi.title
                                                ? "bg-blue-50 text-[#9425FE]"
                                                : "bg-white hover:bg-gray-50 hover:text-yellow-500"
                                                }`}
                                        >
                                            <span>{instruksi.title}</span>
                                            <ChevronDownIcon
                                                className={`w-3 h-3 md:w-5 md:h-5 transition-transform duration-300 stroke-[1.5] ${openSection === instruksi.title ? "rotate-180" : "rotate-0"
                                                    }`}
                                            />
                                        </button>

                                        {openSection === instruksi.title && (
                                            <div className="px-3 pb-3 text-[13px] text-black space-y-1 text-left">
                                                {instruksi.steps.map((step: string, i: number) => (
                                                    <p key={i} dangerouslySetInnerHTML={{ __html: `${i + 1}. ${step}` }} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            onClick={handleBack}
                            className="group bg-yellow-400 text-[#0A0082] text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-md 
                            font-semibold py-3 px-37 md:py-3 lg:py-3 xl:py-3 2xl:py-4 md:px-12 lg:px-32 xl:px-37 2xl:px-49
                            rounded-md flex items-center justify-center gap-2
                            transition-all duration-500 ease-in-out
                            shadow-[4px_4px_0_#0A0082] 
                            hover:bg-[#9425FE] hover:shadow-none
                            active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                            focus:outline-none cursor-pointer"
                        >
                            <span className="flex items-center gap-2 transition-colors duration-500 group-hover:text-white">
                                Kembali
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default TransactionDetailPage;

