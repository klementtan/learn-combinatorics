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
  const { problem_pdf_url, body } = problem;

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
      {problem_pdf_url && (
        <SizeMe
          monitorHeight
          refreshRate={128}
          refreshMode={'debounce'}
          render={({ size }) => (
            <div>
              <Document file={problem_pdf_url} onLoadSuccess={onDocumentLoadSuccess}>
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
