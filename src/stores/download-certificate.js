import { defineStore } from "pinia";
import axios from "@/plugins/api";

export const useDownloadCertificateStore = defineStore("downloadCertificate", {
  state: () => ({
    createdCertificateId: null,
    bookingId: null,
    certificateData: null,
    isLoading: false,
  }),
  actions: {
    async createCertificate(offerId, merchantBranchId) {
      const res = await axios.post("v1/my/certificates", {
        offer_id: String(offerId),
        merchant_branch_id: String(merchantBranchId),
      });
      const certificateId = res?.data?.data?.id ?? null;
      this.createdCertificateId = certificateId;
      return certificateId;
    },

    async createBooking(
      certificateId,
      duration = "unknown",
      flexibleTiming = false
    ) {
      const res = await axios.post("v1/bookings", {
        certificate_id: certificateId,
        duration,
        flexible_timing: flexibleTiming,
      });
      this.bookingId = res?.data?.data?.id ?? null;
      return this.bookingId;
    },

    async getCertificateById(certificateId) {
      const res = await axios.get(`v1/my/certificates/${certificateId}`);
      this.certificateData = res?.data?.data ?? null;
      return this.certificateData;
    },

    async runDownloadFlow(offerId, merchantBranchId) {
      this.isLoading = true;
      try {
        const certificateId = await this.createCertificate(
          offerId,
          merchantBranchId
        );
        if (!certificateId) throw new Error("Certificate ID not found");

        await this.createBooking(certificateId, "unknow", false);
        return await this.getCertificateById(certificateId);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
