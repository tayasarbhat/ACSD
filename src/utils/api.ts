const SHEET_ID = '1CPNWNuNDhlpLnLW3q-RNw4d_iwGJUFARfQeDIvHd_sw';
const SCRIPT_URL = `https://script.google.com/macros/s/AKfycbws6jOTjy_3g1o8Q2lCcLdpWxVBLJefbPNq4x7S-N2_RNmt5cApQ566JDmQ1ywzJuy-WQ/exec`;

export async function fetchMonthData(month: string): Promise<MonthData> {
  try {
    const response = await fetch(`${SCRIPT_URL}?month=${month}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}