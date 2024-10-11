/*! Copyright Braid Technologies 2024 */

// React
import React, { useState } from 'react';
import { createRoot } from "react-dom/client";

// Fluent
import {
   FluentProvider, teamsDarkTheme, makeStyles
} from '@fluentui/react-components';

import { getDefaultLoginEnvironment } from '../../Braid/BraidCommon/src/IEnvironmentFactory';

// Local
import { Persona } from '../core/Persona';
import { EIcon } from '../core/Icons';
import { JoinDetails } from '../core/JoinDetails';
import { EUIStrings } from './UIStrings';
import { innerColumnStyles } from './ColumnStyles';
import { EMainPageMessageTypes, MainPageMessageRow } from './MainPageMessage';
import { JoinPane } from './JoinPane';
import { ConversationControllerRow } from './ConversationController';
import { SessionKey, ConversationKey } from '../core/Keys';
import { getDefaultKeyGenerator } from '../core/IKeyGeneratorFactory';

export interface IAppProps {

}

const fluidFillPageStyles = makeStyles({
   root: {
      minWidth: "512px",  // Ask for enough for at least the error message, plus don't crowd the entry text box - this is a trial value at 512    
   },
});

const pageOuterStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',  /* for a row, the main axis is vertical, flex-end is items aligned to the bottom of the row */
      justifyContent: 'center', /* for a row, the cross-axis is horizontal, center means vertically centered */
      height: '100vh', /* fill the screen with flex layout */ 
      width: '100%',  /* fill the screen with flex layout */       
      marginLeft: '0px',
      marginRight: '0px',
      marginTop: '0px',
      marginBottom: '0px',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '20px',
      paddingBottom: '20px',
      webkitTextSizeAdjust: '100%'
   },
});

export const App = (props: IAppProps) => {

   let localUserPersona = new Persona ();
   localUserPersona.icon = EIcon.kPersonPersona;

   // Environment.override (EEnvironment.kProduction);

   // This little block attempts to pick up a joinpath from the URL after the #value
   // If it looks valid, we pre-populate the joining form
   // *** BE CAREFUL HERE - CAN GENERATE INFINITE RE_RENDERING ***
   var hashValue: string = "";
   if (window.location.hash)
      hashValue = window.location.hash.substring(1);
   
   let joinAttempt = new JoinDetails (hashValue);
   localUserPersona.email = joinAttempt.email; 
   localUserPersona.name = joinAttempt.name;
   const secret = joinAttempt.secret;

   const [lastMessage, setLastMessage] = useState<string>("");
   const [lastMessageType, setLastMessageType] = useState<EMainPageMessageTypes> (EMainPageMessageTypes.kNothing);
   const [lastMessageIsDismissable, setLastMessageIsDismissable] = useState<boolean>(true);   
   
   const [sessionKey, setSessionKey] = useState<SessionKey>(joinAttempt.session);
   const [conversationKey, setConversationKey] = useState<ConversationKey>(joinAttempt.conversation);

   const fluidFillPageClasses = fluidFillPageStyles();
   const pageOuterClasses = pageOuterStyles();
   const innerColumnClasses = innerColumnStyles();
   
   let keyGenerator = getDefaultKeyGenerator();

   if (secret.length > 0 
      && (!keyGenerator.matchesSavedSecret (secret)) 
      && lastMessage !== EUIStrings.kSecretError) {

      setLastMessage (EUIStrings.kSecretError);
      setLastMessageType (EMainPageMessageTypes.kWarning);    
      setLastMessageIsDismissable(false);            
   }

   function onConnect (sessionKey_: SessionKey, conversationKey_: ConversationKey, secret_: string) : void  {
      
      setLastMessage ("");
      setLastMessageType (EMainPageMessageTypes.kNothing);   
      setLastMessageIsDismissable(true);  

      setSessionKey (sessionKey_);
      setConversationKey (conversationKey_);

      keyGenerator.saveSecret (secret_);

      // Start the login process by redirecting to the login API
      // with no email address and no name bcs thats what we get from login
      let query = JoinDetails.toString ("", "", sessionKey_, conversationKey_, secret_);

      let environment = getDefaultLoginEnvironment ();
      let loginUrl = environment.loginWithLinkedInApi();

      location.replace (loginUrl + '?' + query);
   }

   function onConnectError (hint_: string) : void  {

      setLastMessage (EUIStrings.kJoinApiError);
      setLastMessageType (EMainPageMessageTypes.kError);
   }

   function onFluidError (hint_: string) : void  {

      setLastMessage (EUIStrings.kJoinApiError);
      setLastMessageType (EMainPageMessageTypes.kError);
      setLastMessageIsDismissable(true);        

      // Clear the coversation key - takes us back to the join page.
      setConversationKey (new ConversationKey (""));      
   }
   
   function onAiError (hint_: string) : void  {

      setLastMessage (EUIStrings.kAiApiError);
      setLastMessageType (EMainPageMessageTypes.kError);
      setLastMessageIsDismissable(true);        
   }

   function onDismissMessage () : void {

      setLastMessage ("");
      setLastMessageType (EMainPageMessageTypes.kNothing);
      setLastMessageIsDismissable(true);        
   }

   return (
         <FluentProvider theme={teamsDarkTheme} className={fluidFillPageClasses.root}>            
            <div className={pageOuterClasses.root}>    
               <div className={innerColumnClasses.root}>             
      
                  <MainPageMessageRow 
                     intent={lastMessageType} 
                     text={lastMessage} 
                     dismissable={lastMessageIsDismissable}
                     onDismiss={onDismissMessage}/>
      
                  <ConversationControllerRow 
                     sessionKey={sessionKey}
                     conversationKey={conversationKey}
                     secret={secret}
                     localPersona={localUserPersona}
                     onFluidError={onFluidError}
                     onAiError={onAiError}>                          
                  </ConversationControllerRow>      

                  <JoinPane 
                     sessionKey={sessionKey} 
                     conversationKey={conversationKey}
                     secret={secret}                     
                     joinPersona={localUserPersona}                     
                     onConnect={onConnect} 
                     onConnectError={onConnectError}>                     
                  </JoinPane>   

               </div>
            </div>
         </FluentProvider>         
      );
}

// This allows code to be loaded in node.js for tests, even if we dont run actual React methods
if (document !== undefined && document.getElementById !== undefined) {
   const root = createRoot(document.getElementById("reactRoot") as HTMLElement);
   root.render(
      <App />
   ); 

}