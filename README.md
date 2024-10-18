# Braid Technologies Studio
- [General Information](#general-information)
- [Technologies](#technologies)
- [License](#license)

## General Information

This repo contains Braid's pattern applications, for use by Braid's clients. 

The first pattern is '**Waterfall**'. Waterfall is a text analyser / classifier, build to illustrate a possible ticket-classification system for Braid's clients. It illustrates the following:

- **Cascade** (a small waterfall) - an Edge plug in, that scrapes the current web page test, summarises it, and then classifies the text into one of Business, Technology, Sport, Health, or Politics. This is the 'Cascade' directory. Cascade is written in typescript/javascript. 

- Waterfall - a data analysis back end pipeline. This illustrates a date pipline to download web pages, summarise them, and then use cluster analysis to find the most common topics. This is the 'Waterfall' directory. Waterfall is written in Python. 

'**BraidApi**' contains Azure functions that make calls to an Azure hosted OpenAI model to summrise and classify text. Waterfall, Cascade, and Boxer all call Braid Apis for any function requiring server side keys (database or AI model access).

'**BraidCommon**' contains utility classes used across both clients & server - especially API definitions and Types used to generate test scripts. Both subsystems are written in Typescript. Both Cascade and Waterfall make calls to the BraidApis.

'**Salon**' - a place where you do Braiding - is an application that uses the OpenAI Assistant API to generate test code. It processes API definitions written in JSON and generates Python code to test them. The resulting code is in the 'BraidApiTest' directory. 

'**Boxer**', an AI-enabled learning assistant to help developers build generative AI applications more quickly.  It is a full web front end that passes questions to an LLM, and then enriches them with links to relevant document chunks found in its database of useful material - the A16Z AI Cannon. 

## Technologies

For front end development Braid uses Typescript (https://www.typescriptlang.org/), using the Microsoft Fluent UI framework (https://react.fluentui.dev/). Tests are written in Mocha (https://mochajs.org/).

For data processing and AI evaluation, Braid uses Python (https://www.python.org/). Tests are written in Pytest (https://docs.pytest.org/en/stable/).

Braid uses Azure for all processing. 

## Licence
GNU AFFERO GENERAL PUBLIC LICENSE.

This is intentionally a restrictive licence. The source is  available for non-commercial use (subject to the licence terms as listed, which enable use for learning, self study etc). Commercial use either must abide by the licence terms, which are strong, or a separate licence that enables more normal commercial use & distribution is available from Braid. Contact us for more details mailto:info@braidtechnologies.io.
