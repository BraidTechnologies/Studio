''' Send a final Waterfall report by mail '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
from src.workflow import PipelineItem, Theme, WebSearchPipelineSpec
from src.waterfall_pipeline_report_common import write_chart
from src.google_office_mailer import send_mail

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.WARNING)


def create_mail_report(output_location: str, items: list[PipelineItem], themes: list[Theme], spec: WebSearchPipelineSpec, send_final: bool) -> None:
    '''
    Generates a report based on the provided PipelineItems, Themes, and PipelineSpec.

        Parameters:
        - output_location - directory to store file output
        - items (list[PipelineItem]): A list of PipelineItem objects to generate the report from.
        - themes (list[Theme]): A list of Theme objects associated with the PipelineItems.
        - spec (PipelineSpec): The PipelineSpec object containing specifications for the report.
        - send_final - set to false to suppress ending the report - used in testing
    '''

    write_chart (output_location, items, themes, spec)

    logger.debug('Writing summary')
    size = min(len(themes), spec.clusters_in_summary)
    top_themes = themes[:size]
    summary = '<p>Dear Braid Leadership,</p><p>This is an automated mail, please do not reply to this address.</p><p>Please find below the result of the ' + \
        spec.description + \
        ' cluster analysis (' + str(len(items)) + ' samples).</p>'
    summary = summary + '<p>The top ' + \
        str(len(top_themes)) + ' clusters are:</p>'
    for i, theme in enumerate(top_themes):
        summary = summary + '<p>' + \
            str(int(i+1)) + '.' + theme.short_description + '</p>'
        summary = summary + '<p>The closest example of this theme is: ' + \
            theme.example_pipeline_items[0].summary + ', ' + \
            theme.example_pipeline_items[0].path + '</p>'
        summary = summary + '<p>This cluster has ' + \
            str(len(theme.member_pipeline_items)) + ' members.</p>'

    summary = summary + '<p>This message is for the designated recipient only and may contain privileged, proprietary, or otherwise confidential information.' + \
        'If you have received it in error, please notify the sender immediately and delete the original. Any other use of the e-mail by you is prohibited.' + \
        'Where allowed by local law, electronic communications with Braid Technologies Ltd (Braid), including e-mail and instant messaging (including content),' + \
        'may be scanned for the purposes of information security, and assessment of internal compliance with Braid policy.</p>' + \
        '<p>Your privacy is important to us. Braid uses your personal data only in compliance with data protection laws.' + \
        'For further information on how Braid processes your personal data, please see our privacy statement at https://braidtech.ai/privacy</p>'

    encoded_summery = summary.encode('utf-8', errors='ignore')
    if send_final:
        send_mail(output_location, encoded_summery,
                  spec.output_chart_name, spec)

    # output_file = os.path.join(self.output_location, 'summary.txt')
    # with open(output_file, 'w+', encoding='utf-8') as f:
        # f.write(summary)

    return

