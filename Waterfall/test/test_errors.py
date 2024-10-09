# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

test_root = os.path.dirname(__file__)
parent= os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

from src.workflow import PipelineItem
from src.summariser import Summariser

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

def test_basic ():

    logger.error('Error')  
    logger.warning ('Warning')
    logger.info ('Info')
    logger.debug ('Debug')

    assert(True)

def test_with_output ():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'simple_test.html'
    test_output_location = "test+output"
    
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path

    pipeline_item.text = "Let’s be real, the war has started, a former minister tells me. What happens in the Middle East never stays in the Middle East.\
It’s hard not to be moved by the burning conflict – the killing of Israelis by Hamas almost a year ago and agony of the families of hostages snatched; the killing of thousands of Gazans by Israel in its response and the terrible suffering there.\
And now Lebanon, where Israel has struck again after almost a year of cross-border hostilities, killing hundreds in air strikes against Hezbollah. Hundreds of thousands more civilians are on the move, desperate to find safety.\
But it can feel bewildering, and far away. So why does it matter at home?\
There’s the humanitarian horror, says a former diplomat. And of course there are many families in the UK worried about the safety of friends or relatives still in Lebanon, Israel and Gaza. There is a potential bump in the number of refugees likely to head for Europe from Lebanon if all-out war begins.\
The conflict has stirred tensions here as well. We see it on our streets, the former minister says, whether that’s at Gaza protests, the rise in antisemitism or even a handful of pro-Palestinian politicians winning seats in Parliament.\
If - as US President Joe Biden has acknowledged in public - Israel goes ahead and hits Iran’s oil industry, the costs could hit us all.\
The price of oil jumped 5% after Biden’s remarks. Iran is the seventh biggest oil producer in the world. Just at a time when the world has been getting used to inflation cooling down, spiralling costs of energy could pump it right back up again and we’d all feel it.\
One source suggested if the conflict keeps intensifying, the Iranians might block the crucial Strait of Hormuz to show their power which could, they suggest, tip us into a 70s style crisis.\
Around 20% of the world’s oil passes through the narrow channel of water. It’s the pocket book effect, says another Whitehall source. The impact on the economy could be huge.\
So what can the UK do about a hellishly complicated situation, especially with a new government that is still finding its feet? There’s the practical, the defence, and the diplomatic."

    summariser = Summariser (test_output_location)
    enriched_summary : PipelineItem = summariser.summarise (pipeline_item)  

    assert len(enriched_summary.summary) > 0