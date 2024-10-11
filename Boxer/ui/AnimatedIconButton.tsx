/*! Copyright Braid Technologies 2024 */

// React
import React, { useState, useEffect } from 'react';

// Fluent
import {
   makeStyles, 
   Menu,
   MenuButton,
   MenuItem,
   MenuDivider,
   MenuList,
   MenuPopover,
   MenuTrigger,   
} from '@fluentui/react-components';

import {
   Lightbulb24Filled
} from '@fluentui/react-icons';
import { EUIStrings } from './UIStrings';

const animatedGlowIcon = makeStyles({
  root: {        
     boxShadow: '0px 0px 0px 0px white;'
  },
});

export enum EAnimatedIconButtonTypes { // Must mirror MessageBarIntent, with addition of 'nothing' if you dont want to display a message. 
   kLightBulb
}

interface IAnimatedIconButtonProps {
   animate: boolean;
   icon: EAnimatedIconButtonTypes;  
   promptAnimated: string;
   promptUnamimated: string; 
   onClick () : void;
   onCancel () : void;
}

let animatedColourSequence = ['#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999', '#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];
let staticColourSeqeunce = ['#333333'];

// create a forceUpdate hook
// https://stackoverflow.com/questions/46240647/how-to-force-a-functional-react-component-to-render
function useForceUpdate() {
   const [value, setValue] = useState(0); // simple integer state
   return () => setValue(value => value + 1); // update state to force render
}

export const AnimatedIconButton = (props: IAnimatedIconButtonProps) => {

   const [seq, setSeq] = useState<number>(0);
   let localSeq = seq;

   // call the force update hook 
   const forceUpdate = useForceUpdate(); 
      
   function animateColours () : void {
      setSeq (localSeq + 1);
      localSeq = localSeq + 1;
      if (localSeq > animatedColourSequence.length) {
         localSeq = 0;
         setSeq (0);
      }     
      forceUpdate ();             
   } 

   useEffect(() => {
      const interval = setInterval(animateColours, 100);
     
      return (() => {
         if (interval)
            clearInterval(interval);
      });
   }, []);

   const animatedGlowIconClasses = animatedGlowIcon();

   const onClick = (ev: React.MouseEvent<HTMLDivElement>) => {
      props.onClick ();
   }
   const onCancel = (ev: React.MouseEvent<HTMLDivElement>) => {
      props.onCancel ();
   }   

   return (
         <Menu>
            <MenuTrigger disableButtonEnhancement>
               <MenuButton  disabled={!props.animate}
                  icon={<Lightbulb24Filled 
                  className={animatedGlowIconClasses.root} 
                  primaryFill={props.animate ? animatedColourSequence[seq] : staticColourSeqeunce[0]}/>} 
                   />
            </MenuTrigger>

            <MenuPopover>
               <MenuList>
                  <MenuItem onClick={onClick}>{props.promptAnimated}</MenuItem>
                  <MenuDivider/>
                  <MenuItem onClick={onCancel}>{EUIStrings.kNoThanks}</MenuItem>
               </MenuList>
            </MenuPopover>
         </Menu>              
  );

         /* 
         <Tooltip content={props.animate ? props.promptAnimated : props.promptUnamimated} relationship="label">
         <Button 
            disabled={!props.animate}
            icon={<Lightbulb24Filled 
               className={animatedGlowIconClasses.root} 
               primaryFill={props.animate ? animatedColourSequence[seq] : staticColourSeqeunce[0]}/>} 
            onClick={onClick}/>       
            </Tooltip> 
            */  
};