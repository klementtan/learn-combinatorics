import React, { useState } from 'react';

import { Layout, Typography, Card, Row, Col } from 'antd';

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { SizeMe } from 'react-sizeme';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Pdf = props => {
  const { difficulty, title, className, size, color, ...rest } = props;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Card>
      <SizeMe
        monitorHeight
        refreshRate={128}
        refreshMode={'debounce'}
        render={({ size }) => (
          <div>
            <Document file={props.pdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Page width={size.width} pageNumber={pageNumber} />
            </Document>
          </div>
        )}
      />
      <Typography.Paragraph>{props.body}</Typography.Paragraph>
    </Card>
  );
};

export default Pdf;
