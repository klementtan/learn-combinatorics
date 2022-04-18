import React, { useState } from 'react';

import { Layout, Typography, Card, Row, Col } from 'antd';

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { SizeMe } from 'react-sizeme';
import { connect } from 'umi';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ProblemDisplay = props => {
  const { difficulty, title, className, size, color, ...rest } = props;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { problem } = props.attempt;
  const { problem_pdf_url: problemPdfUrlRaw, body } = problem;
  const problemPdfUrl = problemPdfUrlRaw && problemPdfUrlRaw.includes("http://") ? problemPdfUrlRaw.replace("http://", "https://") : problemPdfUrlRaw

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Card
      style={{
        width: '100%',
        marginBottom: '1em',
      }}
    >
      {problemPdfUrl && (
        <SizeMe
          monitorHeight
          refreshRate={128}
          refreshMode={'debounce'}
          render={({ size }) => (
            <div>
              <Document file={problemPdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                <Page width={size.width} pageNumber={pageNumber} />
              </Document>
            </div>
          )}
        />
      )}
      {body && <Typography.Paragraph>{body}</Typography.Paragraph>}
    </Card>
  );
};

export default connect(({ attempt, loading }) => ({
  attempt: attempt,
  loading: loading.models.attempt,
}))(ProblemDisplay);
