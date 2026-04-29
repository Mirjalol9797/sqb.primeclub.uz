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
      const payload = {
        offer_id: String(offerId),
      };
      if (merchantBranchId !== null && merchantBranchId !== undefined) {
        payload.merchant_branch_id = String(merchantBranchId);
      }

      try {
        const res = await axios.post("v1/my/certificates", payload);
        const isSuccess = res?.data?.success !== false;
        if (!isSuccess) {
          this.createdCertificateId = null;
          return {
            success: false,
            certificateId: null,
            response: res?.data || null,
          };
        }
        const certificateId = res?.data?.data?.id ?? null;
        this.createdCertificateId = certificateId;
        return {
          success: true,
          certificateId,
          response: res?.data || null,
        };
      } catch (error) {
        const errorData = error?.response?.data;
        if (errorData?.success === false) {
          this.createdCertificateId = null;
          return {
            success: false,
            certificateId: null,
            response: errorData,
          };
        }
        throw error;
      }
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
        const createResult = await this.createCertificate(
          offerId,
          merchantBranchId
        );
        if (!createResult?.success) {
          return {
            status: "already_received",
            response: createResult?.response || null,
          };
        }
        const certificateId = createResult?.certificateId;
        if (!certificateId) throw new Error("Certificate ID not found");

        await this.createBooking(certificateId, "unknown", false);
        const certificateData = await this.getCertificateById(certificateId);
        return {
          status: "success",
          certificateId,
          certificateData,
        };
      } finally {
        this.isLoading = false;
      }
    },
  },
});
