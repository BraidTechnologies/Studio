'''Testing use of Google Office'''
from workflow import WebPipelineSpec
import os
import os.path
import base64
import mimetypes
from email.message import EmailMessage
from email.mime.base import MIMEBase

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.send']


def send_mail(output_location: str, body: str, attachment: str, spec: WebPipelineSpec):
    '''Use Gmail API to send the report
    Lists the user's Gmail labels.
    '''
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    token_path = os.path.join(output_location, 'token.json')
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            credential_path = os.path.join(output_location, 'credentials.json')
            flow = InstalledAppFlow.from_client_secrets_file(
                credential_path, SCOPES
            )
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(token_path, 'w+') as token:
            token.write(creds.to_json())

    try:
        # Call the Gmail API
        service = build('gmail', 'v1', credentials=creds)
        send_message_with_attachment(
            service, output_location, body, attachment, spec)

    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f'An error occurred: {error}')


def send_message_with_attachment(service, output_location: str, body: str, attachment: str, spec: WebPipelineSpec):
    '''Create and insert a draft email with attachment.
     Print the returned draft's message and id.
    Returns: Draft object, including draft id and message meta data.

    Load pre-authorized user credentials from the environment.
    See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.
    '''

    try:
        # create gmail api client
        message = EmailMessage()

        #Body in HTML format
        message.add_header('Content-Type','text/html')
        message.set_payload(body)

        # headers
        message['To'] = spec.mail_to
        message['From'] = 'waterfall@braidapps.io'
        message['Subject'] = spec.description

        # attachment
        attachment_path = os.path.join(output_location, attachment)        

        # guessing the MIME type
        type_subtype, _ = mimetypes.guess_type(attachment_path)
        maintype, subtype = type_subtype.split('/')

        with open(attachment_path, 'rb') as fp:
            attachment_data = fp.read()
        message.add_attachment(attachment_data, maintype, subtype)

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        create_message = {'raw': encoded_message}

        # pylint: disable=E1101
        send_message = (
            service.users()
            .messages()
            .send(userId='me', body=create_message)
            .execute()
        )
        print(f'Message Id: {send_message['id']}')
    except HttpError as error:
        print(f'An error occurred: {error}')
        send_message = None
    return send_message


def build_file_part(file):
    '''Creates a MIME part for a file.

    Args:
      file: The path to the file to be attached.

    Returns:
      A MIME part that can be attached to a message.
    '''
    content_type, encoding = mimetypes.guess_type(file)

    if content_type is None or encoding is not None:
        content_type = 'application/octet-stream'
    main_type, sub_type = content_type.split('/', 1)
    with open(file, 'rb'):
        msg = MIMEBase(main_type, sub_type)
        msg.set_payload(file.read())

    filename = os.path.basename(file)
    msg.add_header('Content-Disposition', 'attachment', filename=filename)

    return msg
