/*! Copyright Braid Technologies 2024 */
 
// React
import React, { ChangeEvent, useState, useLayoutEffect } from 'react';

// Fluent
import { InputOnChangeData, makeStyles, Textarea } from '@fluentui/react-components';

import { EUIStrings } from './UIStrings';
import { throwIfUndefined } from '../core/Asserts';
import { EConfigNumbers, EConfigStrings } from '../core/ConfigStrings';

export interface IMessagePromptProps {

   message: string;
   onSend (message_: string) : void;   
   onChange (message_: string) : void;
}

const textFieldStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
   },
   textarea: {
      width: '100%',      
      height: '100%',
      textAlign: 'left',
      verticalAlign: 'top',
   },
   prompt: {
      textAlign: 'center',
      fontSize: '8pt',
      color: 'grey',
      width: '100%',       
   }
});

export function wrapText(context: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null, 
   text: string,
   width: number, 
   defaultHeight: number, defaultWidth: number,
   lineSeparation: number): number {

      let y = 0;
      let hardLines = text.split("\n");


   // Special case if we dont have any text - allow provision for one line
   if (hardLines.length === 0)
      return defaultHeight;

   let dy = 0;
   let lines = 0;

   for (var iHardLines = 0; iHardLines < hardLines.length; iHardLines++) {

      var line = "";
      var words = hardLines[iHardLines].split(" ");
      var lineWidth = 0;
      var lineHeightDelta = defaultHeight;

      for (var iWords = 0; iWords < words.length; iWords++) {
         var testLine = line + words[iWords] + " ";
         var testWidth;

         if (context) {
            let metrics = context.measureText(testLine);
            testWidth = metrics.width;
            lineHeightDelta = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;            
         }
         else {
            testWidth = defaultWidth * testLine.length;
            lineHeightDelta = defaultHeight;           
         }

         // Finish if we have incrementally exceeded maxWidth, 
         // or if we only have one word so we have to finish any way. 
         if ((testWidth > width) || ((testWidth > width) && iWords === 0)) {
            line = words[iWords] + " ";
            y += lineHeightDelta;
            dy += lineHeightDelta;
            lineWidth = (testWidth - lineWidth) - defaultWidth / 2;
            lines++;

            if ((iWords + 1) < words.length)
               dy += lineSeparation;
         }
         else {
            line = testLine;
            lineWidth = testWidth - defaultWidth / 2;
         }
      }

      if (context) {
         let metrics = context.measureText(line);
         testWidth = metrics.width;
         lineHeightDelta = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;            
      }
      else {
         testWidth = defaultWidth * line.length;
         lineHeightDelta = defaultHeight;       
      }

      y += lineHeightDelta;
      dy += lineHeightDelta;
      lines++;
      if ((iHardLines + 1) < hardLines.length)
         dy += lineSeparation;      
   }

   return dy;
}

// Ref
// https://blog.steveasleep.com/how-to-draw-multi-line-text-on-an-html-canvas-in-2021
export function calculateDyNeeded (width: number, value: string): number {

   const smallestTextForWrap = "A";

   let offScreenCanvas = new OffscreenCanvas(width, width * 10);
   throwIfUndefined (offScreenCanvas);
   let offscreenContext = offScreenCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D; 
   offscreenContext.font = EConfigStrings.kFontNameForTextWrapCalculation;

   let metrics = offscreenContext.measureText(smallestTextForWrap);
   let spaceCharWidth = metrics.width;
   let spaceCharHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent; 

   let dyNeeded = wrapText(offscreenContext, value.length > 0 ? value: smallestTextForWrap,
         width - EConfigNumbers.kMessagePrompt2HBorder,
         spaceCharHeight,
         spaceCharWidth,
         EConfigNumbers.kMessagePromptLineSpace);

   let dyMin = wrapText(offscreenContext, smallestTextForWrap,
         width,
         spaceCharHeight,
         spaceCharWidth,
         EConfigNumbers.kMessagePromptLineSpace);         

   // Tidy up
   offScreenCanvas = null as any as OffscreenCanvas;
   offscreenContext = null as any as OffscreenCanvasRenderingContext2D;

   return Math.max (dyMin, dyNeeded);
}

export const MessagePrompt = (props: IMessagePromptProps) => {   

   const textFieldClasses = textFieldStyles();
   const [width, setWidth] = useState(0); 
   const textAreaId = "textAreaId;"  
   
   useLayoutEffect(() => {
      
      const textArea = document.getElementById(
         textAreaId
       ) as HTMLTextAreaElement | null;

      if (textArea) {
         let dx = textArea.offsetWidth; 

         if (width !== dx) {
            setWidth(dx);         
         }
      } 
    }, []);

   function onKeyChange(ev: ChangeEvent<HTMLTextAreaElement>, data: InputOnChangeData): void {

      props.onChange (data.value);
   } 

   /*
   * looks to see if the user has Ctrl-enter, and if so processes a Commit
   * @param event - Keyboard Event
   * @param value - current text value
   */
   function onSend(event: React.KeyboardEvent<HTMLElement>, value: string) {

      var processed: boolean = false;

      switch (event.key) {

         case 'Enter':
            if (event.ctrlKey) {
               props.onSend (value);
               processed = true;
            }
            break;

         case 'Escape':
            props.onChange ("");
            processed = true;
            break;            

         default:
            break;
      }
  
      if (processed) {
         event.stopPropagation();
         event.preventDefault();
      }
   };

   let bump = EConfigNumbers.kMessagePrompt2VBorder;
   var dyNeeded = bump;

   if (width !== 0) 
      dyNeeded = calculateDyNeeded (width, props.message) + bump;   

   return (<div className={textFieldClasses.root}> 
      <Textarea
         id={textAreaId}
         appearance="outline"
         placeholder={EUIStrings.kSendMessagePlaceholder}
         maxLength={EConfigNumbers.kMessagePromptMaxCharacters}
         textarea={{ className: textFieldClasses.textarea }}
         resize="none"
         value={props.message}
         onChange={onKeyChange}
         style={{
            height: (dyNeeded).toString() + 'px',
            width: '100%'
         }}
         onKeyDown={(e) => onSend(e, props.message)} 
         disabled={false}      
         autoFocus={true}                 
      /> 
      <div className={textFieldClasses.prompt}>{EUIStrings.kMessageTextPrompt}</div>
      </div>);
}

