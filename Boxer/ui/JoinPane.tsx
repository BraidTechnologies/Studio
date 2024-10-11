/*! Copyright Braid Technologies 2024 */

// React
import React, { ChangeEvent, MouseEvent, useState } from 'react';

// Fluent
import {
   makeStyles, shorthands, 
   Dropdown, Option, Tooltip, Button,
   Text, Input, Image, 
   InputOnChangeData,
   SelectionEvents,
   OptionOnSelectData
} from '@fluentui/react-components';

import {
   Key24Regular
} from '@fluentui/react-icons';

import { getDefaultFluidEnvironment } from '../../Braid/BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../Braid/BraidCommon/src/IEnvironment';

import { Persona } from '../core/Persona';
import { SessionKey, ConversationKey } from '../core/Keys';
import { JoinPageValidator } from '../core/JoinPageValidator';
import { KeyRetriever } from '../core/KeyRetriever';
import { EUIStrings } from './UIStrings';
import { EConfigStrings } from '../core/ConfigStrings';
import { innerColumnFooterStyles, textFieldStyles } from './ColumnStyles';
import { throwIfUndefined } from '../core/Asserts';
import { getDefaultKeyGenerator } from '../core/IKeyGeneratorFactory';

export interface IJoinPageProps {
   sessionKey: SessionKey;  
   conversationKey: ConversationKey;
   secret: string;
   joinPersona: Persona;
   onConnect (sessionKey_: SessionKey, 
              conversationKey_: ConversationKey,
              secret_: string) : void;
   onConnectError (hint_: string) : void;    
}

const joinPageInnerStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'column',  
   },
});

const joinFormRowStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row',    
   },
});

 const buttonDisabledStyles = makeStyles({
   root: {    
      filter: 'grayscale(100%)',
      marginLeft: 'auto', 
      marginRight: '0'
   },
});

const buttonEnabledStyles = makeStyles({
   root: {    
      filter: 'grayscale(0%)',
      marginLeft: 'auto', 
      marginRight: '0'
   },
});

const dropdownStyles = makeStyles({
   root: {
     // Stack the label above the field with a gap
     display: "grid",
     gridTemplateRows: "repeat(1fr)",
     justifyItems: "start",
     ...shorthands.gap("2px"),
     maxWidth: "400px",
   },
 });

 function conversationKeyFromName (name: string) : ConversationKey {
   
   switch (name) {
      case EUIStrings.kTestConversationName:
         return new ConversationKey ("");  
      case EUIStrings.kDemoConversationName:  
         return new ConversationKey (EConfigStrings.kDemoConversationKey);                     
      case EUIStrings.kCohort1Team1ConversationName:
         return new ConversationKey (EConfigStrings.kCohort1Team1ConversationKey);            
      case EUIStrings.kCohort1Team2ConversationName:
         return new ConversationKey (EConfigStrings.kCohort1Team2ConversationKey);              
      case EUIStrings.kCohort1Team3ConversationName:
         return new ConversationKey (EConfigStrings.kCohort1Team3ConversationKey);    
      case EUIStrings.kCohort1ConversationName:
      default:
         return new ConversationKey (EConfigStrings.kCohort1ConversationKey);                   
      }   
 }


export const JoinPane = (props: IJoinPageProps) => {

   const joinPageInnerClasses = joinPageInnerStyles();   
   const joinFormRowClasses = joinFormRowStyles();
   const innerColumnFooterClasses = innerColumnFooterStyles(); 
   const stretchClasses = textFieldStyles();
   const buttonDisabledClasses = buttonDisabledStyles();
   const buttonEnabledClasses = buttonEnabledStyles();
   const dropdownClasses = dropdownStyles();

   const retriever = new KeyRetriever();

   /*
    * @param runningInLocalEnv
    * This logic with runningInLocalEnv is bcs when running against a local fluid framework, we dont know the container ID
    * we have to let the code create a new container then share it manually in the URL#string
    * In production, we have well known container IDs which were created beforehand.
   */
   let runningInLocalEnv: boolean = (getDefaultFluidEnvironment().name === EEnvironment.kLocal);

   let defaultConversationName = EUIStrings.kCohort1ConversationName;
   var conversations: Array<string>;
   
   if (runningInLocalEnv) {
      conversations = [EUIStrings.kTestConversationName];
      defaultConversationName = EUIStrings.kTestConversationName;      
   }
   else {
      conversations = [
         EUIStrings.kCohort1ConversationName,
         EUIStrings.kCohort1Team1ConversationName,
         EUIStrings.kCohort1Team2ConversationName,
         EUIStrings.kCohort1Team3ConversationName,
         EUIStrings.kDemoConversationName
      ];
      defaultConversationName = EUIStrings.kCohort1ConversationName;    
   }

   const [sessionKey, setSessionKey] = useState<SessionKey>(props.sessionKey); 
   const [selectedConversationNames, setSelectedConversationNames] = React.useState<string[]>([
      defaultConversationName
   ]);
   const [conversationName, setConversationName] = React.useState<string>(defaultConversationName);
  
   function onConversationSelect (ev: SelectionEvents, data: OptionOnSelectData) {

      let conversationName = data.optionText;

      setSelectedConversationNames(data.selectedOptions);
      throwIfUndefined (conversationName); // Make compiler happy for next line
      setConversationName(conversationName);     
   };

   function onKeyChange(ev: ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void {

      let newSessionKey = new SessionKey (data.value);

      setSessionKey(newSessionKey);
   }   

   function onTryJoin(ev: MouseEvent<HTMLButtonElement>): void {
      
      ev.preventDefault();

      tryToJoin();
   }

   function tryToJoin () : void {
      
      let conversationKey : ConversationKey;

      if (runningInLocalEnv) {
         conversationKey = props.conversationKey;
      }
      else {
         conversationKey = conversationKeyFromName (conversationName);
      }

      let joinValidator = new JoinPageValidator ();

      let secret = "";

      let keyGenerator = getDefaultKeyGenerator();

      if (! joinValidator.haveSavedSecret ()) {       
         secret = keyGenerator.generateSecret();
         keyGenerator.saveSecret (secret);
      }
      else {
         secret = keyGenerator.savedSecret();
      }

      props.onConnect (sessionKey, conversationKey, secret);
   }

   let joinValidator = new JoinPageValidator ();

   if (joinValidator.matchesSavedSecret (props.secret)) {
      return (<div></div>);
   }
   else {
      return (
         <div className={innerColumnFooterClasses.root} >               
            <div className={joinPageInnerClasses.root}>  
               &nbsp;              
               <div className={joinFormRowClasses.root}>             
                  <Text align="start" className={stretchClasses.root}>{EUIStrings.kJoinPagePreamble}</Text> 
               </div>             
               &nbsp;         
               <div className={joinFormRowClasses.root}>                   
                  <Tooltip withArrow content={EUIStrings.kJoinConversationKeyPrompt} relationship="label">
                     <Input aria-label={EUIStrings.kJoinConversationKeyPrompt}
                        className={stretchClasses.root}                  
                        required={true}                  
                        value={sessionKey.toString()}
                        maxLength={75}
                        contentBefore={<Key24Regular />}
                        placeholder={EUIStrings.kJoinConversationKeyPlaceholder}
                        onChange={onKeyChange}
                        disabled={false}
                        autoFocus={true}
                     />
               </Tooltip>  
               </div>
               &nbsp;
               <div className={joinFormRowClasses.root}>     
                  <div className={dropdownClasses.root}>              
                     <Tooltip withArrow content={EUIStrings.kJoinConversationPicker} relationship="label">
                        <Dropdown
                           defaultValue={defaultConversationName}
                           defaultSelectedOptions={[defaultConversationName]}
                           onOptionSelect={onConversationSelect}
                           {...props}
                        >
                           {conversations.map((conversation) => (
                              <Option key={conversation}>
                                 {conversation}
                              </Option>
                           ))}
                        </Dropdown>
                     </Tooltip>      
                  </div>    
                  &nbsp;          
                  &nbsp;    
                  &nbsp;                                                   
                  <Button onClick={onTryJoin} >        
                     <Tooltip withArrow content={EUIStrings.kJoinConversationWithLinkedInPrompt} relationship="label">
                        <Image className={sessionKey.looksValidSessionKey()? buttonEnabledClasses.root : buttonDisabledClasses.root}
                           alt={EUIStrings.kJoinConversationWithLinkedInPrompt}
                           src="assets/img/SignInWithLinkedIn.png"
                        />
                     </Tooltip>  
                  </Button>              
               </div>               
               &nbsp;                   
               <div className={joinFormRowClasses.root}> 
                  <Text className={stretchClasses.root}>{sessionKey.looksValidSessionKey() ? EUIStrings.kJoinConversationLooksLikeKeyOk : EUIStrings.kJoinConversationDoesNotLookLikeKey}</Text>   
               </div>
               &nbsp;                
            </div>                          
         </div>
      );
   };
}
