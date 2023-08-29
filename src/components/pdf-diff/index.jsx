import './style.less'
import PdfRender from "../pdf-render"
import { useRef, useState } from 'react'
import cs from 'classnames';


export default (props) => {
    // 当前激活第几个高亮
    const [currentLight, setCurrentLight] = useState();


    // 左右关联滚动
    const rightPdf = useRef();
    const leftPdf = useRef();
    const onScrollRight = (e) => {
        const pdfContainer = leftPdf.current.pdfHighlighterRef.current.containerNode;
        pdfContainer.scrollTop = e.target.scrollTop;
    }
    const onScrollLeft = (e) => {
        const pdfContainer = rightPdf.current.pdfHighlighterRef.current.containerNode;
        console.log(e.target.scrollTop);
        pdfContainer.scrollTop = e.target.scrollTop;
    }


    /**
 * 点击差异点时
 * 更改地址栏
 * 设置高亮圈
 * */
    const onClickDiff = (index, id) => {
        document.location.hash = `highlight-${id}`;
        setCurrentLight(index);
    };

    return (
        <div className="pdf-diff">
            <div className='content'>
                <PdfRender onScroll={onScrollLeft} ref={leftPdf} {...props.files[0]} />
                <PdfRender onScroll={onScrollRight} ref={rightPdf} {...props.files[1]} />
            </div>

            <div className='utils'>
                {props.files[0].highlights.map(({ id, position: { rects: [{ backgroundColor }] } }, index) => {
                    return (
                        <div key={index} className={cs('item', { active: currentLight === index })} style={{ backgroundColor }} onClick={() => { onClickDiff(index, id) }}>
                            {index + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}