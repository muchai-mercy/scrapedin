const logger = require('../logger')

const showSelector = 'a[data-control-name=contact_see_more]'

const getContactInfo = async(page) => {
  await page.waitFor(showSelector, { timeout: 2000 })
    .catch(() => {
      logger.warn('contact-info', 'selector not found')
      return {}
    })

  const element = await page.$(showSelector)
  await element.click()
  await new Promise((resolve) => { setTimeout(() => { resolve() }, 3000)})

  const contactInfo = await page.$$eval('div.pv-profile-section__section-info',elements => {
    const data = [];
    elements.map(e => {
      e.querySelectorAll("section.pv-contact-info__contact-type").forEach(e => {
        let header = e.querySelector('header').textContent.trim();
        let [link, text, list] = [e.querySelector('div a'), e.querySelector('div span'), e.querySelector('ul')];
        if (list) {
          list.querySelectorAll('li').forEach(e => {
            const anchor = e.querySelector('a');
            let text = anchor ? anchor.getAttribute('href') : e.querySelectorAll('span')[0].textContent;
            let cat = anchor ? e.querySelector('span').textContent.trim().replace(/[\("\)]/g, '') : e.querySelectorAll('span')[1].textContent.trim().replace(/[\("\)]/g, '');
            data.push({link: text, key: cat})
          });
        } else if (link) {
          data.push({link: link.textContent.trim(), key: header})
        } else if (text) {
          data.push({link: text.textContent.trim(), key: header})

        }
      });
    });
    return data;
  });

  return contactInfo
}

module.exports = getContactInfo
