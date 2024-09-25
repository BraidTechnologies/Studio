# Braid Technologies Studio
- [General Information](#general-information)
- [Technologies](#technologies)
- [License](#license)

## General Information

This repo contains Braid's pattern applications, for use by Braid's clients. 

The first pattern is 'Waterfall'. Waterfall is a text analyser / classifier, build to illustrate a possible ticket-classification system for Braid's clients. It illustrates the following:

- A front end - an Edge plug in, that scrapes the current web page test, summarises it, and then classifies the text into one of Business, Technology, Sport, Health, or Politics. This is the 'Cascade' directory. Cascade is all written in typescript/javascript. (A CAscade is a small Waterfall ...). 

- A data analysis back end. This illustrates a date pipleine to download web pages, summarise them, and then uses cluster analysis to find the most common topics. This is the 'Waterfall' directory. Waterfall is written in Python. 

The 'BraidApi' directory contains Azure functions that make calls to an Azure hosted OpenAI model to summrise and classify text. 'BraidCommon' contains untility classes used across multiple applications. Both subsystems are written in Typescript. Both Cascade and Waterfall make calls to the BraidApis.

The second pattern, 'Boxer', is in the process of being moved to this repo. Boxer is an AI-enabled learning assistant to help developers build generative AI applications more quickly.  

## Technologies

For front end development Braid uses Typescript (https://www.typescriptlang.org/), using the Microsoft Fluent UI framework (https://react.fluentui.dev/). Tests are written in Mocha (https://mochajs.org/).

For data processing and AI evaluation, Braid uses Python (https://www.python.org/). Tests are written in Pytest (https://docs.pytest.org/en/stable/).

Braid uses Azure for all processing. 

## Licence
GNU AFFERO GENERAL PUBLIC LICENSE.

This is intentionally a restrictive licence. The source is  available for non-commercial use (subject to the licence terms as listed, which enable use for learning, self study etc). Commercial use either must abide by the licence terms, which are strong, or a separate licence that enables more normal commercial use & distribution is available from Braid. Contact us for more details mailto:info@braidtechnologies.io.
