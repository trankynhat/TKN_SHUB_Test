const axios = require("axios");

async function processData() {
  try {
    // Lấy dữ liệu từ API
    const response = await axios.get(
      "https://test-share.shub.edu.vn/api/intern-test/input"
    );
    const { token, data, query } = response.data;

    const n = data.length;
    const prefixSum = new Array(n + 1).fill(0);
    const evenOddSum = new Array(n + 1).fill(0);

    //Tiền xử lý dữ liệu
    for (let i = 0; i < n; i++) {
      prefixSum[i + 1] = prefixSum[i] + data[i];
      evenOddSum[i + 1] = evenOddSum[i] + (i % 2 === 0 ? data[i] : -data[i]);
    }

    const results = [];

    // Xử lý các truy vấn
    for (const { type, range } of query) {
      const [l, r] = range;
      if (type === "1") {
        // Tính tổng các phần tử trong khoảng
        results.push(prefixSum[r + 1] - prefixSum[l]);
      } else if (type === "2") {
        // Tính tổng các phần tử ở vị trí chẵn và trừ đi tổng các phần tử ở vị trí lẻ
        results.push(evenOddSum[r + 1] - evenOddSum[l]);
      }
    }

    // Gửi kết quả về API
    await axios
      .post("https://test-share.shub.edu.vn/api/intern-test/output", results, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((postResponse) => {
        // In ra kết quả trả về từ server
        console.log("Kết quả từ server:", postResponse.data);
      });

    console.log("Kết quả đã được gửi thành công!");
  } catch (error) {
    console.error(
      "Đã xảy ra lỗi:",
      error.response ? error.response.data : error.message
    );
  }
}
processData();
