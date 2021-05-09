import React, { useState } from 'react';

import { Layout, Typography, Card, Row, Col, Modal } from 'antd';

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { SizeMe } from 'react-sizeme';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const PdfViewer = props => {
  const { difficulty, title, className, size, color, ...rest } = props;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <>
      <Card
        onClick={showModal}
        hoverable
        cover={
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
        }
      >
        <Card.Meta description="Click to enlarge" />
      </Card>
      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
      </Modal>
    </>
  );
};

export default PdfViewer;
