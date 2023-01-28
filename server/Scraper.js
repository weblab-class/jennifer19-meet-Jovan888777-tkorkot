//import React, { Component, useEffect } from "react";

//const Scraper = (props) => {
const puppeteer = require('puppeteer');
const { container } = require('webpack');
const url_maseeh = "https://mit.cafebonappetit.com/cafe/the-howard-dining-hall-at-maseeh/";
const url_simmons = "https://mit.cafebonappetit.com/cafe/simmons/";
const url_next = "https://mit.cafebonappetit.com/cafe/next/";
const url_new_vassar = "https://mit.cafebonappetit.com/cafe/new-vassar/";
const url_mccormick = "https://mit.cafebonappetit.com/cafe/mccormick/";
const url_baker = "https://mit.cafebonappetit.com/cafe/baker/";



async function scrapeProduct(url) {
  //launching browser
  const browser = await puppeteer.launch();
  //launching the page
  const page = await browser.newPage();
  //launching new page
  await page.goto(url);

  let finalContent = [];

  //containers = main wrappers around the meals
  //breakfast dinner or lunch
  const containers = await page.$$(".site-panel__daypart-wrapper");
  for (let i = 0; i < containers.length; i++) {
    let elements = await containers[i].$$(".site-panel__daypart-item");
    //actual elements in there
    let allobj = [];
    for (let j = 0; j < elements.length; j++) {
      let title = ""; let titleText = "";
      let description = ""; let descriptionText = "";
      let tags = [];
      let images = ""; let keywords = ""; let keywordsArray = [];
      title = await elements[j].$(".site-panel__daypart-item-title");
      description = await elements[j].$(".site-panel__daypart-item-content");
      tags = await title.$(".site-panel__daypart-item-cor-icons");
      if (title) {
        titleText = await(await title.getProperty('textContent')).jsonValue();
        titleText = titleText.trim();
      }
      if (description) {
        descriptionText = await(await description.getProperty('textContent')).jsonValue();
        descriptionText = descriptionText.trim();
        if (descriptionText.includes("\n"))
          descriptionText = "";
      }
      if (tags) {
        images = await tags.$$("img");
        for (let k = 0; k < images.length; k++) {
          keywords = await(await images[k].getProperty('title')).jsonValue();
          keywords = keywords.slice(0, 5);
          if (keywords === 'Veget') keywords = 'Vegetarian';
          else if (keywords === 'Vegan') keywords = 'Vegan';
          else if (keywords === 'Made ') keywords = 'Gluten-Free';
          else if (keywords === 'In Ba') keywords = 'In Balance';
          else if (keywords === 'Halal') keywords = 'Halal';
          else if (keywords === 'Seafo') keywords = 'Seafood Watch';
          else if (keywords === 'Human') keywords = 'Humane';

          keywordsArray.push(keywords);
        }    
      }
      
      if (titleText) {
        allobj.push(
          {
            dishName: titleText,
            dishDesc: descriptionText,
            restrictions: keywordsArray,
          }
        );
      }
    }
    finalContent.push(allobj);
  }
  browser.close();

  return finalContent;
}

module.exports = {
  scrapeProduct
};