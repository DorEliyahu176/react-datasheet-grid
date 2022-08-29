import React, { FC, useContext, useEffect, useRef, Fragment } from 'react'
import { HeaderContext } from '../contexts/HeaderContext'
import cx from 'classnames'
import { Cell } from './Cell'
import { Column } from '../types'

export const HeaderRow = React.memo(() => {
  const {
    columns,
    contentWidth,
    height,
    hasStickyRightColumn,
    activeColMin,
    activeColMax,
    setColumnsWidth,
  } = useContext(HeaderContext)

  return (
    <div
      className={cx('dsg-row', 'dsg-row-header')}
      style={{
        width: contentWidth ? contentWidth : '100%',
        height,
      }}
    >
      {columns.map((column, i) => (
        <Cell
          key={i}
          gutter={i === 0}
          stickyRight={hasStickyRightColumn && i === columns.length - 1}
          column={column}
          className={cx(
            'dsg-cell-header',
            activeColMin !== undefined &&
              activeColMax !== undefined &&
              activeColMin <= i - 1 &&
              activeColMax >= i - 1 &&
              'dsg-cell-header-active',
            column.headerClassName
          )}
        >
          {(i > 0) ? 
            <Fragment>
              <div className="dsg-cell-header-container" style={{marginRight: 'calc(100% - 20px)'}}>{column.title}</div>
              <Resizer column={column} setColumnWidth={setColumnsWidth} columnIndex={i - 1} />
            </Fragment>
            :
            <div className="dsg-cell-header-container">{column.title}</div>
          }
        </Cell>
      ))}
    </div>
  )
})

const Resizer: FC<{
  column: Column<any, any, any>
  setColumnWidth: any,
  columnIndex: number
}> = ({ column, setColumnWidth, columnIndex }) => {
  // Track the current position of mouse

  const x = useRef(0)
  const w = useRef(0)
  const resizerRef = useRef<any>()

  useEffect(() => {
    console.log('column:');
    console.log(column);
    resizerRef.current.addEventListener('mousedown', mouseDownHandler)

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
    }
  }, [])

  const mouseDownHandler = function (e: any) {
    // Get the current mouse position
    x.current = e.clientX

    const width = resizerRef.current.parentElement.clientWidth

    w.current = width

    console.log('/******** mouseDownHandler ********/');
    console.log('e.clientX=' + e.clientX);
    console.log('width=' + width);

    // Attach listeners for document's events
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }

  const mouseMoveHandler = function (e: any) {
    // Determine how far the mouse has been moved
    const dx = e.clientX - x.current
    console.log('/******** mouseMoveHandler ********/');
    console.log('dx=' + dx);
    // Update the width of column
    setColumnWidth((cols: any) =>
      cols.map((col: any) => {
        console.log('col=');
        console.log(col);
        if (col.id === column.columnData.key) {
          console.log('col.id=' + col.id);
          console.log('w.current=' + w.current);
          col.width = w.current + dx;
          console.log('col.width=' + col.width);
        }
        return col;
      })
    )

    // setColumnWidth((cols: any) =>
    //   cols.map((col: any, i: number) => {
    //     console.log('col=');
    //     console.log(col);
    //     if (i === columnIndex) {
    //       console.log('i='+i)
    //       console.log('columnIndex='+columnIndex)
    //       col.width = col.width + w.current + dx;
    //     }
    //     console.log('col=');
    //     console.log(col);
    //     return col;
    //   })
    // )

    // setColumnWidth((cols: any) => {
    //   console.log('cols=');
    //   console.log(cols);
    //   console.log('cols[columnIndex].width=' + cols[columnIndex].width);
    //   cols[columnIndex].width = w.current + dx;
    //   console.log('cols[columnIndex].width=' + cols[columnIndex].width);
    // });
  }

  // When user releases the mouse, remove the existing event listeners
  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }

  // return <div ref={resizerRef} className="dsg-resizer" style={{ height: '100%', width: '10px', backgroundColor: '#3C968F', borderColor: '#3C968F', zIndex: 999, justifyContent: 'flex-end', cursor: 'col-resize'}}></div>
  return <div ref={resizerRef} className="dsg-resizer" style={{ height: '100%', width: '10px', zIndex: 999, justifyContent: 'flex-end', cursor: 'col-resize'}}></div>
}

HeaderRow.displayName = 'HeaderRow'
