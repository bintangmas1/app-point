import React from "react";
import { Link } from "react-router-dom";
import { useCustomers } from "../../hooks/useCustomers";

const Top5 = () => {
  const {
    data: topCustomers,
    loading,
    error,
  } = useCustomers({
    status: true,
    orderBy: "point",
    ascending: false,
    limit: 5,
  });

  if (loading) {
    return (
      <div className="page-content-wrapper py-3">
        <div className="container text-center">
          <p>Memuat data pelanggan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content-wrapper py-3">
        <div className="container text-center text-danger">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-2">
        <div
          className="bg-gradient rounded-3 p-4 position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {/* Decorative Elements Mini */}
          <div
            className="position-absolute opacity-10"
            style={{ top: "-10px", right: "-10px" }}
          >
            <i className="bi bi-stars" style={{ fontSize: "3rem" }}></i>
          </div>

          {/* Main Content */}
          <div className="position-relative d-flex align-items-center">
            <div className="me-3">
              <i
                className="bi bi-balloon-heart text-primary"
                style={{ fontSize: "1.8rem" }}
              ></i>
            </div>
            <div className="flex-fill text-white">
              <h4 className="fw-bold mb-1">Top 5 Customers</h4>
              <p className="mb-0 small opacity-90">
                Leaderboard pelanggan terbaik
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="customer-list">
        {topCustomers.map((item, index) => (
          <Link
            key={item.id}
            to={`/customer/detail/${item.id}`}
            className="affan-element-item d-flex align-items-center justify-content-between text-decoration-none mb-3 p-4 rounded-3 shadow-sm border-0"
            style={{
              transition: "all 0.3s ease",
              borderLeft:
                index === 0
                  ? "4px solid #FFD700"
                  : index === 1
                    ? "4px solid #C0C0C0"
                    : index === 2
                      ? "4px solid #CD7F32"
                      : "4px solid #667eea",
            }}
          >
            {/* Points Section */}
            <div
              className="points-section me-4 text-center"
              style={{ minWidth: "90px" }}
            >
              <div className="fw-bold text-warning fs-4">{item.point}</div>
              <div className="small text-warning">
                <i className="bi bi-arrow-up-circle"></i> poin
              </div>
            </div>

            {/* Customer Info */}
            <div className="customer-info flex-fill">
              <h5 className="mb-2 fw-bold text-dark">{item.name}</h5>
            </div>

            <div
              className="ranking-section me-4 text-center"
              style={{ minWidth: "60px" }}
            >
              {index === 0 && <div className="fs-3">🥇</div>}
              {index === 1 && <div className="fs-3">🥈</div>}
              {index === 2 && <div className="fs-3">🥉</div>}
              {index > 2 && (
                <div
                  className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "45px", height: "45px", fontSize: "1.1rem" }}
                >
                  {index + 1}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Top5;
