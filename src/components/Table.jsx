import React, { useEffect, useState } from "react";
import styles from "./table.module.css";

const Table = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
    )
      .then((response) => response.json())
      .then((data) => setProjects(data || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return projects.slice(startIndex, startIndex + recordsPerPage);
  };

  const handleNextClick = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousClick = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const totalPages = Math.ceil(projects.length / recordsPerPage);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Table</h1>
      <table className={styles.table} aria-label="Saas Table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Percentage Funded</th>
            <th>Amount Pledged</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedData().map((project, index) => (
            <tr key={project.id}>
              <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
              <td>{project["percentage.funded"]}</td>
              <td>{project["amt.pledged"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={handlePreviousClick}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.pageButton}
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
