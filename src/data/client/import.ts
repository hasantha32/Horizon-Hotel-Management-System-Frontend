import { HttpClient } from './http-client';

export const importClient = {
  importCsv: async (url: string, variables: any) => {
    let formData = new FormData();
    formData.append('csv', variables?.csv);
    formData.append('shop_id', variables?.shop_id);
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await HttpClient.post<any>(url, formData, options);
    return response.data;
  },
};
