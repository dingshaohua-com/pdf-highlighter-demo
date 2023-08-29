import './App.less';
import PdfDiff from './components/pdf-diff'
import { pdfUrl1, pdfUrl2, getCompareResult } from './utils/mock-data';


function App() {

  const files = [
    {
      url:pdfUrl1,
      highlights: getCompareResult().source
    },
    {
      url:pdfUrl2,
      highlights: getCompareResult().target
    }
  ];

  return (
    <div className="app">
      <div className='head'>文档对比</div>
      <PdfDiff files={files} />
    </div>
  );
}

export default App;
