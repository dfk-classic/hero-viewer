import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Popover, { PopoverProps } from '../Popover'

/* Matches the card's CSS .tooltip pills (HeroCard/styles.module.css) */
const TooltipContainer = styled.div`
  width: auto;
  padding: 2px 10px;
  line-height: 140%;
  font-weight: 400;
  font-size: 11px;
  font-family: "Poppins", sans-serif;
  white-space: nowrap;
  text-align: center;
  text-transform: capitalize;
  color: #fff;
`

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: string
}

export default function Tooltip({ text, ...rest }: TooltipProps) {
  return <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
}

export function MouseoverTooltip({ children, ...rest }: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}
