import * as api from "../api/index";

export const DashboardService = {
  getDashboardDeliveredNumberCount,
  getDashboardTotalRevenue,

  getDashboardParentBaseRevenue,
  getDashboardParentDeliveryNumberCount,
};

async function getDashboardDeliveredNumberCount(formData) {
  try {
    const { data } = await api.getDashboardDeliveredNumberCount(formData);
    return { isSuccess: true, data: data };
  } catch (error) {
    return { isSuccess: false, data: error };
  }
}

async function getDashboardTotalRevenue(formData) {
  try {
    const { data } = await api.getDashboardTotalRevenue(formData);
    return { isSuccess: true, data: data };
  } catch (error) {
    return { isSuccess: false, data: error };
  }
}

async function getDashboardParentBaseRevenue(formData, page, rowsPerPage) {
  try {
    const { data } = await api.getDashboardParentBaseRevenue(
      formData,
      page,
      rowsPerPage
    );
    return { isSuccess: true, data: data };
  } catch (error) {
    return { isSuccess: false, data: error };
  }
}

async function getDashboardParentDeliveryNumberCount(
  formData,
  page,
  rowsPerPage
) {
  try {
    const { data } = await api.getDashboardParentDeliveryNumberCount(
      formData,
      page,
      rowsPerPage
    );
    return { isSuccess: true, data: data };
  } catch (error) {
    return { isSuccess: false, data: error };
  }
}
