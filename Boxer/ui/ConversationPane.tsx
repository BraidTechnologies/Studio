/*! Copyright Braid Technologies 2024 */

// React
import React, { useState, useEffect } from 'react';

// Fluent
import {
   makeStyles, shorthands, 
   Button, 
   Toolbar, ToolbarButton, ToolbarDivider,
   Tooltip, 
   Body1,
   Caption1,
   Link,
   Text, 
   Spinner, 
   SpinnerProps,
   partitionAvatarGroupItems,
   AvatarGroup,
   AvatarGroupPopover,
   AvatarGroupItem
} from '@fluentui/react-components';

import {
   Person24Regular,
   Laptop24Regular,
   Send24Regular,
   Copy24Regular,
   Delete24Regular, 
   DoorArrowLeft24Regular,
   ChatMultipleRegular,
   ChatMultipleHeartRegular,
   ChatMultipleHeartFilled,
   DeleteRegular,
   ChatOffRegular,
   ChatAddRegular   
} from '@fluentui/react-icons';

import { EIcon } from '../core/Icons';
import { EConfigNumbers, EConfigStrings }  from '../core/ConfigStrings';
import { Persona } from '../core/Persona';
import { Message } from '../core/Message';
import { EUIStrings } from './UIStrings';
import { innerColumnFooterStyles, textFieldStyles } from './ColumnStyles';
import { SessionKey, ConversationKey } from '../core/Keys';
import { JoinDetails } from '../core/JoinDetails';
import { AnimatedIconButton, EAnimatedIconButtonTypes } from './AnimatedIconButton';
import { MessagePrompt } from './ConversationMessagePrompt';
import { Media } from '../core/Media';
import { SharedEmbedding, findInMap } from '../core/SharedEmbedding';

import { IRelevantEnrichedChunk } from '../../Braid/BraidCommon/src/EnrichedChunk';

export interface IConversationHeaderProps {

   userisAdmin: boolean;
   sessionKey: SessionKey;
   conversationKey: ConversationKey;   
   audience: Map<string, Persona>;
   braidChattinessLevel: number;
   onTrimConversation () : void;  
   onExitConversation () : void;  
   onSetBraidChattiness (level: number, max: number) : void;  
}

export interface IConversationViewProps {

   isConnected: boolean;
   userIsAdmin: boolean;
   sessionKey: SessionKey;
   conversationKey: ConversationKey;    
   audience: Map<string, Persona>;
   conversation: Array<Message>;
   localPersonaName: string;
   sharedEmbeddings: Map<string, SharedEmbedding>;
   isBusy: boolean;   
   hasSuggestedContent: boolean;
   suggestedContent: string;
   suppressScroll: boolean;
   braidChattinessLevel: number;
   onSend (message_: string) : void;   
   onTrimConversation () : void;   
   onExitConversation () : void;
   onAddSuggestedContent (): void;
   onCancelSuggestedContent (): void;
   onClickUrl (url_: string): void;   
   onLikeUrl (url_: string): void;   
   onUnlikeUrl (url_: string): void;     
   onDeleteMessage (id: string) : void;   
   onSetBraidChattiness (level: number, max: number) : void;
}

const headerRowStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%' 
   },
});

export const ConversationHeaderRow = (props: IConversationHeaderProps) => {

   let chatLevelForPrompt = props.braidChattinessLevel + 1;
   let maxChatLevelForPrompt = EConfigNumbers.kMaxChatLevel + 1; 

   let lessChatPrompt = EUIStrings.kBoxerLessChatButtonPrompt.replace ("%%1", chatLevelForPrompt.toString())
                                                             .replace ("%%2", maxChatLevelForPrompt.toString());

   let moreChatPrompt = EUIStrings.kBoxerMoreChatButtonPrompt.replace ("%%1", chatLevelForPrompt.toString())
                                                             .replace ("%%2", maxChatLevelForPrompt.toString());

   let canHaveLessChat = props.braidChattinessLevel > 0;
   let canHaveMoreChat = props.braidChattinessLevel < EConfigNumbers.kMaxChatLevel;

   const headerRowClasses = headerRowStyles();

   // Copy audience to an array for consumption by Fluent classes
   let audienceArray = Array.from(props.audience.values());

   const { inlineItems, overflowItems } = partitionAvatarGroupItems({
      items: audienceArray
    });


   function onCopy (ev: React.MouseEvent<HTMLButtonElement>) : void {

      // Make join details with no email address and no name
      let joinDetails = JoinDetails.makeFromParts ("", "", props.sessionKey, props.conversationKey, "");
      
      // https://stackoverflow.com/questions/10783322/window-location-url-javascript

      let newUrl = window.location.protocol + // => "http:"
      '//' +
      window.location.host +                  // => "example.com:3000"
      window.location.pathname +              // => "/pathname/
      '#' + joinDetails.toString();

      navigator.clipboard.writeText (newUrl);
   }       

   function onMoreChat (ev: React.MouseEvent<HTMLButtonElement>) : void {

      if (props.braidChattinessLevel < EConfigNumbers.kMaxChatLevel) {
         let newChatLevel = props.braidChattinessLevel + 1;
         props.onSetBraidChattiness (newChatLevel, EConfigNumbers.kMaxChatLevel);
      }
   } 

   function onLessChat (ev: React.MouseEvent<HTMLButtonElement>) : void {
      if (props.braidChattinessLevel > 0) {     
         let newChatLevel = props.braidChattinessLevel - 1;
         props.onSetBraidChattiness (newChatLevel, EConfigNumbers.kMaxChatLevel);         
      }
   }    

   function onTrimConversation (ev: React.MouseEvent<HTMLButtonElement>) : void {

      props.onTrimConversation();
   } 

   function onExitConversation (ev: React.MouseEvent<HTMLButtonElement>) : void {

      props.onExitConversation();
   }           

   return (
      <div className={headerRowClasses.root}>
         <AvatarGroup>
            {inlineItems.map((persona) => (
               <Tooltip content={persona.name} relationship="label" positioning={'below'} key={persona.id}>
                  <AvatarGroupItem name={persona.name} key={persona.id} />
               </Tooltip>
            ))}
            {overflowItems && (
               <AvatarGroupPopover indicator="icon">
                  {overflowItems.map((persona) => (
                     <AvatarGroupItem name={persona.name} key={persona.id} />
                  ))}
               </AvatarGroupPopover>
            )}
         </AvatarGroup>  
         <ToolbarDivider />
         <Toolbar aria-label="Conversation control toolbar" >                  
            <Tooltip content={EUIStrings.kCopyConversationUrlButtonPrompt} 
               relationship="label" positioning={'below'}>
               <ToolbarButton
                  icon={<Copy24Regular />}
                  aria-label={EUIStrings.kCopyConversationUrlButtonPrompt} 
                  disabled={!(props.sessionKey.looksValidSessionKey() && props.conversationKey.looksValidConversationKey())} 
                  onClick={onCopy}
               />                 
            </Tooltip>           
            <Tooltip content={lessChatPrompt} 
               relationship="label" positioning={'below'}>
               <ToolbarButton
                  icon={<ChatOffRegular />}
                  aria-label={lessChatPrompt} 
                  disabled={!canHaveLessChat} 
                  onClick={onLessChat}
               />  
            </Tooltip>        
            <Tooltip content={moreChatPrompt} 
               relationship="label" positioning={'below'}>
               <ToolbarButton
                  icon={<ChatAddRegular />}
                  aria-label={moreChatPrompt} 
                  disabled={!canHaveMoreChat} 
                  onClick={onMoreChat}
               />  
            </Tooltip>                
            <Tooltip content={EUIStrings.kTrimConversationButtonPrompt} 
               relationship="label" positioning={'below'}>
               <ToolbarButton
                  icon={<Delete24Regular />}
                  aria-label={EUIStrings.kTrimConversationButtonPrompt} 
                  disabled={!(props.userisAdmin && props.sessionKey.looksValidSessionKey() && props.conversationKey.looksValidConversationKey())} 
                  onClick={onTrimConversation}
               />  
            </Tooltip>       
            <Tooltip content={EUIStrings.kExitConversationButtonPrompt} 
               relationship="label" positioning={'below'}>
               <ToolbarButton
                  icon={<DoorArrowLeft24Regular />}
                  aria-label={EUIStrings.kExitConversationButtonPrompt} 
                  disabled={!(props.sessionKey.looksValidSessionKey() && props.conversationKey.looksValidConversationKey())} 
                  onClick={onExitConversation}
               />  
            </Tooltip>                                                   
         </Toolbar>           
      </div>
   );
}

const embeddedRowStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      alignItems: 'stretch',   /* for a row, the main axis is vertical, stretch means fill the row with content */
      justifyContent: 'center' /* for a row, the cross-axis is horizontal, center means vertically centered */           
   },
});

const embeddedColumnStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'    // start layout at the top                  
   },
});

const conversationContentRowStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row',         
      width: '100%',           
      alignItems: 'stretch',   /* for a row, the main axis is vertical, stretch means fill the row with content */
      overflowY: 'auto'
   },
});

const conversationContentColumnStyles = makeStyles({
   root: {  
      display: 'flex',
      flexDirection: 'column',                        
      width: '100%',
      overflowY: 'auto'     
   },
});

const DefaultSpinner = (props: Partial<SpinnerProps>) => <Spinner {...props} />;


export const ConversationView = (props: IConversationViewProps) => {

   const embeddedRowClasses = embeddedRowStyles();
   const embeddedColumnClasses = embeddedColumnStyles();   
   const conversationContentRowClasses = conversationContentRowStyles();
   const conversationContentColumnClasses =  conversationContentColumnStyles();
   const footerSectionClasses = innerColumnFooterStyles();   
   const alwaysScrollToBottomId = "AlwaysScrollToBottom";
    
   // Shorthand only
   let conversation = props.conversation;
   let audience = props.audience;

   function onSend (messageText_: string) : void {

      props.onSend (messageText_);
      if (!props.suppressScroll)
         scroll();
   }

   // https://stackoverflow.com/questions/45719909/scroll-to-bottom-of-an-overflowing-div-in-react 
   function scroll (): void {

      const divScroll = document.getElementById(
         alwaysScrollToBottomId
       ) as HTMLDivElement | null;

      if (divScroll) {
         divScroll.scrollIntoView();
      }       
   }
 
   useEffect(() => {
      if (!props.suppressScroll)      
         scroll();
    });     

   if (! props.isConnected) {
      return (<div></div>);
   }
   else {
      return (
         <div className={embeddedRowClasses.root}>      
            <div className={embeddedColumnClasses.root}>                     

               <ConversationHeaderRow 
                  userisAdmin={props.userIsAdmin}
                  sessionKey={props.sessionKey} 
                  conversationKey={props.conversationKey}
                  audience={props.audience} 
                  onTrimConversation={props.onTrimConversation}      
                  onExitConversation={props.onExitConversation}
                  onSetBraidChattiness={props.onSetBraidChattiness}
                  braidChattinessLevel={props.braidChattinessLevel}
                  >                                                                       
               </ConversationHeaderRow>
               
               &nbsp;

               <div className={conversationContentRowClasses.root}>                
                  <div className={conversationContentColumnClasses.root}>             
                     {conversation.map (message => { 
                        return (         
                           <SingleMessageView 
                              sessionKey={props.sessionKey}
                              message={message} 
                              localPersonaName={props.localPersonaName}                              
                              key={message.id}
                              author={Persona.safeAuthorLookup (audience, message.authorId)}
                              userIsAdmin={props.userIsAdmin}
                              sharedEmbeddings={props.sharedEmbeddings}
                              showAiWarning={message.authorId === EConfigStrings.kLLMGuid}
                              onClickUrl={props.onClickUrl}  
                              onLikeUrl={props.onLikeUrl}   
                              onDislikeUrl={props.onUnlikeUrl}
                              onDeleteMessage={props.onDeleteMessage}
                           />
                        )                     
                     })}                          
                     <div id={alwaysScrollToBottomId}/>  
                  </div>               
               </div>

               &nbsp;  

               <div className={footerSectionClasses.root}>               
                  {props.isBusy ? <DefaultSpinner/> : <div/>}              
                  <InputView 
                     onSend={onSend}
                     suggestedContent={props.suggestedContent} 
                     isBusy={props.isBusy}
                     hasSuggestedContent={props.hasSuggestedContent}
                     onAddSuggestedContent={props.onAddSuggestedContent}
                     onCancelSuggestedContent={props.onCancelSuggestedContent}>
                     </InputView>          
               </div> 
            </div>
         </div>
     );
   }
}

export interface ISingleMessageViewProps {

   sessionKey: SessionKey;
   message: Message;  
   author: Persona;
   showAiWarning: boolean;
   localPersonaName: string;   
   sharedEmbeddings: Map<string, SharedEmbedding>;  
   userIsAdmin: boolean; 
   onClickUrl (url_: string) : void;    
   onLikeUrl (url_: string) : void;  
   onDislikeUrl (url_: string) : void;     
   onDeleteMessage (id: string) : void;
}

 export interface IAuthorIconProps {
 
   author: Persona; 
}

export interface IKnowledgeSegmentProps {

   sessionKey: SessionKey;
   segment: IRelevantEnrichedChunk;  
   key: string;
   localPersonaName: string;
   sharedEmbeddings: Map<string, SharedEmbedding>;   
   onClickUrl (url_: string) : void;    
   onLikeUrl (url_: string) : void;  
   onUnlikeUrl (url_: string) : void;      
}

const glow = makeStyles({
   root: {    
      marginBottom: '10px' ,      
      boxShadow: '0px 0px 5px 0px white;'
   },
});

const noGlow = makeStyles({
   root: {    
      marginBottom: '10px'       
   },
});

 export const AuthorIcon = (props: IAuthorIconProps) => {

   const glowClasses = glow();    
   const noGlowClasses = noGlow(); 
   var className;

   if (props.author.icon === EIcon.kLLMPersona) {
      className = glowClasses.root;
   }
   else {
      className = noGlowClasses.root;      
   }

   return ((props.author.icon === EIcon.kLLMPersona) ?
            <Laptop24Regular className={className} />
            : <Person24Regular className={className}/>
   );
}

const singleMessageRow = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'left'
   },
});

const singleMessageIconColumn = makeStyles({
   root: {    
      ...shorthands.margin("10px"),      
      display: 'flex',
      flexDirection: 'column'
   },
});

const singleMessageTextColumn = makeStyles({
   root: {    
      ...shorthands.margin("10px"),       
      display: 'flex',
      flexDirection: 'column'
   },
});

const sourcesRow = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left'
   },
});

const padAfterMessage = makeStyles({
   root: {    
      marginBottom: '10px'    
   },
});

const linkStyles = makeStyles({
   root: {    
      marginRight: '10px',
      justifySelf: 'centre'      
   },
});

const greenStyles = makeStyles({
   root: {    
      color: 'green',
      justifySelf: 'centre'       
   },
});

const amberStyles = makeStyles({
   root: {    
      color: 'orange',
      justifySelf: 'centre'  
   },
});

const toolbarRowStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
   },
});

const toolbarButtonStyles = makeStyles({
   root: {    
      alignSelf: 'centre',
      marginLeft: '5px',
      marginRight: '5px'
   }
});

const buttonStyles = makeStyles({
   root: {
      flexGrow: '0',
      flexShrink: '0'      
   }
});

export const KowledgeSegmentsView = (props: IKnowledgeSegmentProps) => {

   const sourcesClasses = sourcesRow();
   const greenClasses = greenStyles();
   const amberClasses = amberStyles();

   let relevantChunk = props.segment;
   let relevanceText = relevantChunk.relevance ? (relevantChunk.relevance * 100).toPrecision(2) + '%': "";
   
   const onClickLink = (event: React.MouseEvent<HTMLAnchorElement>): void => {
      // NB we call 'prevent default' as we want to control the action i.e. open a  new tab. 
      event.stopPropagation();
      event.preventDefault();

      props.onClickUrl (relevantChunk.chunk.url);  
      (window as any).open(relevantChunk.chunk.url, '_blank');
   };

   const onClickLike = (event: React.MouseEvent<HTMLButtonElement>): void => {
      // NB we call 'prevent default' as we want to control the action  
      event.stopPropagation();
      event.preventDefault();

      props.onLikeUrl (relevantChunk.chunk.url);        
   }   

   const onClickUnlike = (event: React.MouseEvent<HTMLButtonElement>): void => {
      // NB we call 'prevent default' as we want to control the action  
      event.stopPropagation();
      event.preventDefault();

      props.onUnlikeUrl (relevantChunk.chunk.url);       
   }   

   let relevanceClasses = relevantChunk.relevance ? relevantChunk.relevance >= 0.5 ? greenClasses : amberClasses : amberClasses; 
   let linkClasses = linkStyles();
   let toolbarRowClasses = toolbarRowStyles();  
   let toolbarButtonClasses = toolbarButtonStyles();   
   
   let linkText = relevantChunk.chunk.url;
   
   let media = new Media();
   let maxLength = EConfigNumbers.kMaximumLinkTextlength;
   if (media.isSmallFormFactor()) 
      maxLength = EConfigNumbers.kMaximumLinkTextlengthMobile;

   if (linkText.length > maxLength + 3) {
      linkText = linkText.slice (0, maxLength) + '...';
   }

   let likedByMe = false;
   let likedByAnyone = false;
   let likeText = "";
   let shared = findInMap (relevantChunk.chunk.url, props.sharedEmbeddings);
   if (shared) {
      likedByMe = shared.isLikedBy (props.localPersonaName); 
      likedByAnyone = shared.netLikeCount > 0;  
      if (likedByAnyone) {
         let count =  shared.likes.length;

         if (count > 1)
            likeText = count.toString() + " " + EUIStrings.kLikePlural;
         else
            likeText = count.toString() + " " + EUIStrings.kLikeSignular;         
      }   
   }


   return (<div className={sourcesClasses.root} key={relevantChunk.chunk.url}>
              <div className={toolbarRowClasses.root}>
                 <Link className={linkClasses.root} 
                    href={relevantChunk.chunk.url} onClick={onClickLink} inline>{linkText}                
                  </Link>
                  <Body1 className={relevanceClasses.root}> {relevanceText} </Body1>
                  <Toolbar aria-label="Like/dislike control toolbar" >                        
                     <ToolbarDivider />                  
                     <Tooltip content={likedByMe ? EUIStrings.kDidNotLikeThis : EUIStrings.kLikedThis} relationship="label" positioning={'above'}>                     
                        <ToolbarButton
                           className={toolbarButtonClasses.root}
                           icon={likedByMe? <ChatMultipleHeartFilled/> : likedByAnyone ? <ChatMultipleHeartRegular/> : <ChatMultipleRegular/>} 
                           onClick={likedByMe ? onClickUnlike : onClickLike}/>   
                     </Tooltip> 
                     <Text size={100}>{likeText}</Text>    
                  </Toolbar>                                              
               </div>
               <Body1 className={toolbarRowClasses.root}> {relevantChunk.chunk.summary} </Body1>
            </div>      
         );
}

// create a forceUpdate hook
// https://stackoverflow.com/questions/46240647/how-to-force-a-functional-react-component-to-render
function useForceUpdate() {
   const [value, setValue] = useState(0); // simple integer state
   return () => setValue(value => value + 1); // update state to force render
}

export const SingleMessageView = (props: ISingleMessageViewProps) => {

   const singleMessageRowClasses = singleMessageRow();
   const singleMessageIconColumnClasses = singleMessageIconColumn();
   const singleMessageColumnClasses = singleMessageTextColumn();
   const toolbarButtonClasses = toolbarButtonStyles(); 
   const toolbarRowClasses = toolbarRowStyles();  

   const padAfterMessageClasses = padAfterMessage();  
   const amberClasses = amberStyles();

   // we can omly delete our own messages
   let canDelete = props.userIsAdmin || (props.author.name === props.localPersonaName);

   const onDeleteMessage = (event: React.MouseEvent<HTMLButtonElement>): void => {
      // NB we call 'prevent default' as we want to control the action  
      event.stopPropagation();
      event.preventDefault();

      props.onDeleteMessage (props.message.id);        
   } 

   var aiSources;
   var aiFooter;   

   if (props.showAiWarning) {
      
      if (props.message.chunks.length > 0) { 

         aiSources = props.message.chunks.map ((releventChunk : IRelevantEnrichedChunk) => {
            return <KowledgeSegmentsView sessionKey={props.sessionKey} 
                    localPersonaName={props.localPersonaName}
                    segment={releventChunk} key={releventChunk.chunk.url} 
                    sharedEmbeddings={props.sharedEmbeddings}
                    onClickUrl={props.onClickUrl}
                    onLikeUrl={props.onLikeUrl}
                    onUnlikeUrl={props.onDislikeUrl}/>
         })   
         aiFooter = <Text size={100}> {EUIStrings.kAiContentWarning} </Text>;   
      }
      else {
         aiSources = <Text size={100} className={amberClasses.root}> {EUIStrings.kAiNoGoodSources} </Text>;  
         aiFooter = <div/>;         
      }
   } 
   else {
      aiFooter = <div/>;
      aiSources = <div/>;
   }

   return (
      <div className={singleMessageRowClasses.root}>
         <div className={singleMessageIconColumnClasses.root}>
            <AuthorIcon author={props.author} />            
         </div>   
         <div className={singleMessageColumnClasses.root}>
            <Caption1><b>{props.author.name}</b></Caption1> 
            <div className={toolbarRowClasses.root}>                
               <Body1>{props.message.text}</Body1>  
               <Toolbar aria-label="Delete control toolbar" >                        
                  <ToolbarDivider />                  
                  <Tooltip content={EUIStrings.kDeleteMessage} relationship="label" positioning={'above'}>                     
                     <ToolbarButton
                        className={toolbarButtonClasses.root}
                        disabled={!canDelete}
                        icon={<DeleteRegular/>} 
                        onClick={onDeleteMessage}/>   
                  </Tooltip>    
               </Toolbar>              
            </div>
            <div className={padAfterMessageClasses.root}></div>              
            {aiSources}  
            <div className={padAfterMessageClasses.root}></div>                     
            {aiFooter}
            <div className={padAfterMessageClasses.root}></div> 
         </div>              
      </div>);    
}

export interface IInputViewProps {
   
   isBusy: boolean;
   hasSuggestedContent: boolean;
   suggestedContent: string;
   onSend (message_: string) : void;
   onAddSuggestedContent(): void;
   onCancelSuggestedContent() : void;
}

 const inputGroupStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'column',      
      textAlign: 'left',
      width: '100%'
   },
});

const inputRowStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row',      
      textAlign: 'left',
      width: '100%'
   },
});

const textColumnStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'column',      
      width: '100%'
   },
});

const bottonColumnStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'column',      
      width: 'fit-content'   
   },
});

const bottonRowStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row',      
      justifyContent: 'flex-end'
   },
});

export const InputView = (props: IInputViewProps) => {

   const inputGroupClasses =inputGroupStyles();
   const inputRowClasses = inputRowStyles();
   const textColumnClasses = textColumnStyles();
   const buttonColumnClasses = bottonColumnStyles();   
   const buttonRowClasses = bottonRowStyles();      
   const buttonClasses = buttonStyles();

   const [message, setMessage] = useState<string>("");
   const [canSend, setCanSend] = useState<boolean>(false);

   function onSend (message_: string) : void {

      props.onSend (message);
      setMessage ("");   
      setCanSend (false);        
   }   

   function onChange (message_: string) : void {

      setMessage (message_);   
      setCanSend (message_.length > 0);        
   }  

   function onMessageSend (ev: React.MouseEvent<HTMLButtonElement>) : void {

      onSend(message);       
   }

   return (
      <div className={inputGroupClasses.root}>
         <Text>{EUIStrings.kSendMessagePreamble}</Text>
         &nbsp;
         <div className={inputRowClasses.root}>
            <div className={textColumnClasses.root}>
               <MessagePrompt onSend={onSend} onChange={onChange} message={message} />               
            </div>
            &nbsp;           
            <div className={buttonColumnClasses.root}>
               <div className={buttonRowClasses.root}>                              
                  <Button 
                     className={buttonClasses.root}
                     disabled={(!canSend) || (props.isBusy)}
                     icon={<Send24Regular/>} 
                     onClick={onMessageSend}/>                                               
                  &nbsp;                  
                  <AnimatedIconButton animate={props.hasSuggestedContent} 
                     icon={EAnimatedIconButtonTypes.kLightBulb} 
                     promptAnimated={props.suggestedContent} 
                     promptUnamimated={EUIStrings.kAiHasNoSuggestedDocuments}
                     onClick={props.onAddSuggestedContent}
                     onCancel={props.onCancelSuggestedContent}/>                               
                  </div>
            </div>       
         </div>   
      </div>        
   );
}