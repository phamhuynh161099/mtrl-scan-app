/**
 * Xoa di ky tu '/' dau tien cua path
*/
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}


/**
 ** Hàm nhận biệt đât là mã code nào Pantone Rubber Material Others
 */
export const classifyTypeBarcode = (barcode: string) => {
  let result_type = ''; //* Pantone Rubber Material Others
  let barcodeNotContainSubNumber = barcode.split("-")[0] || '';

  const regex = /\d{20}/; // Biểu thức chính quy để tìm kiếm 20 chữ số (\d) liên tiếp ({20})
  const regex_number12 = /\d{12}/; // Biểu thức chính quy để tìm kiếm 12 chữ số (\d) liên tiếp ({12})

  if (barcodeNotContainSubNumber.startsWith("PAN")) {
    result_type = "Pantone"
  } else if (barcodeNotContainSubNumber.startsWith("RUB")) {
    result_type = "Rubber"
  } else if (regex.test(barcodeNotContainSubNumber)) {
    result_type = "Others"
  } else if (regex_number12.test(barcodeNotContainSubNumber)) {
    result_type = "Mcs"
  } else {
    result_type = "Material"
  }

  return result_type
}