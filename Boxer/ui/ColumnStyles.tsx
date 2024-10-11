// Copyright (c) 2024 Braid Technologies Ltd

// Fluent
import {
   FluentProvider, teamsDarkTheme, makeStyles, Text
} from '@fluentui/react-components';

import { EUIStrings } from './UIStrings';

export const innerColumnStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',    // start layout at the top       
      alignItems: 'center',
      maxWidth: EUIStrings.kMaxColumnWidth
   },
});

export const innerColumnMidStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row'
   },
});

export const innerColumnFooterStyles = makeStyles({
   root: {    
      display: 'flex',
      flexDirection: 'row',
      marginTop: 'auto',
      alignSelf: 'flex-end'      
   },
});

export const textFieldStyles = makeStyles({
   root: {    
      width: '100%'
   },
});