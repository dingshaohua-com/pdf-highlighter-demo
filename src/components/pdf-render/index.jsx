// @ts-nocheck
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { PdfLoader, PdfHighlighter, Tip, Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';

function PdfRender(props, ref) {
  useEffect(() => {
    // 监听hash变化
    window.addEventListener('hashchange', scrollToHighlightFromHash, false);
  },[]);

  /**
   * 根据hash路由改变， 滑动到高亮处
   * 此处用于点击中间模块的小圆圈，跳转到对应位置
   * */
  let scrollViewerTo = (highlight) => { };
  const scrollToHighlightFromHash = () => {
    const parseIdFromHash = () => document.location.hash.slice('#highlight-'.length);
    const getHighlightById = (id) => {
      return props.highlights.find((highlight) => highlight.id === id);
    };
    const highlight = getHighlightById(parseIdFromHash());
    if (parseIdFromHash() !== '' && highlight) {
      scrollViewerTo(highlight);
    }
  };

  /**
   * 查看高亮的提示组件
   * */
  const HighlightPopup = ({ comment }) =>
    comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null;

  const scrollRef = (scrollTo) => {
    // 监听pdf内容滚动事件
    const pdfContainer = pdfHighlighterRef.current.containerNode;
    pdfContainer.addEventListener('scroll', props.onScroll)

    // 官方demo代码
    scrollViewerTo = scrollTo;
    scrollToHighlightFromHash();
  }

  const highlightTransform = (...p)=> {
    // 选中完成点击tip事件
    const [highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo] = p;
    const isTextHighlight = !Boolean(highlight.content && highlight.content.image);

    const component = isTextHighlight ? (
      <Highlight isScrolledTo={isScrolledTo} position={highlight.position} comment={highlight.comment} />
    ) : (
      <AreaHighlight
        isScrolledTo={isScrolledTo}
        highlight={highlight}
        onChange={(boundingRect) => {
          updateHighlight(highlight.id, { boundingRect: viewportToScaled(boundingRect) }, { image: screenshot(boundingRect) });
        }}
      />
    );
    return <Popup popupContent={<HighlightPopup {...highlight} />} onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)} onMouseOut={hideTip} key={index} children={component} />;
  }

  const onScrollChange = ()=>{
    
  }
  const pdfHighlighterRef = useRef();

  useImperativeHandle(ref, () => ({
    pdfHighlighterRef
  }));

  return <div className='pdf-render'>
    <PdfLoader url={props.url}>
      {(pdfDocument) => (<PdfHighlighter
        ref={pdfHighlighterRef}
        pdfDocument={pdfDocument}
        highlights={props.highlights}
        highlightTransform = {highlightTransform}
        scrollRef={scrollRef}
        onScrollChange={onScrollChange}
      />
      )}
    </PdfLoader>
  </div>;
}
export default forwardRef(PdfRender);
