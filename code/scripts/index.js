import ReactDOM from 'react-dom'
import React from 'react'
import LiveDemo from './components/liveDemo'
import SnippetGenerator from './components/snippetGenerator'
import SnippetDisplay from './components/snippetDisplay'
import { parse } from 'qs'
import config from './config'

document.addEventListener('DOMContentLoaded', function() {
  const topSnippetGeneratorContainer = document.getElementById('snippet-generator-top')
  const bottomSnippetGeneratorContainer = document.getElementById('snippet-generator-bottom')
  const snippetDisplayContainer = document.getElementById('snippet-display')
  const liveDemoContainer = document.getElementById('live-demo')

  if (topSnippetGeneratorContainer) {
    ReactDOM.render(<SnippetGenerator inStaging={config.inStaging} />, topSnippetGeneratorContainer)
  }

  if (bottomSnippetGeneratorContainer) {
    ReactDOM.render(<SnippetGenerator className="callout--dark" inStaging={config.inStaging} />, bottomSnippetGeneratorContainer)
  }

  if (snippetDisplayContainer) {
    ReactDOM.render(<SnippetDisplay fileName={config.assetFileName} />, snippetDisplayContainer)
  }

  if (liveDemoContainer) {
    ReactDOM.render(<LiveDemo />, liveDemoContainer)
  }

  window.howdy = {
    handleStartSubscription() {
      const queryString = parse(window.document.location.search.substr(1))
      const { verificationToken, edit } = queryString

      if (window.$ && Stripe) {
        const $ = window.$
        const $form = $('#payment-form')
        const qsData = verificationToken ? atob(verificationToken).split('|') : ['test', 'test@test.com']
        const id = qsData[0]
        const email = qsData[1]

        $form.find('input[name="email"]').prop({ value: email, disabled: true })
        $form.submit((event) => {
          $form.find('.submit').prop('disabled', true)

          Stripe.setPublishableKey(config.stripeKey)
          Stripe.card.createToken($form, (status, response) => {
            if (response.error) {
              $form.find('.payment-errors').text(response.error.message)
              return $form.find('.submit').prop('disabled', false)
            }

            const postData = JSON.stringify({
              id: id,
              stripePaymentToken: response.id
            })

            let url = config.createSubscriptionUrl
            let successFunction = (data) => {
              if (window.mixpanel) mixpanel.track('Started subscription', { topic: name })
              return window.location.replace('https://howdyform.com/subscription-started.html')
            }
            if (edit) {
              url = config.updateSubscriptionUrl
              successFunction = (data) => {
                if (window.mixpanel) mixpanel.track('Updated payment card')
                return window.location.replace('https://howdyform.com/card-updated.html')
              }
            }

            return $.ajax({
              type: 'POST',
              url: url,
              // The key needs to match your method's input parameter (case-sensitive).
              data: postData,
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              success: successFunction,
              failure: function(errMsg) {
                return alert(errMsg)
              }
            })
          })

          // Prevent the form from being submitted:
          return false
        })
      }
    },

    handleVerifyRecipient() {
      // Check whether any verification requests need to be made:
      const queryString = parse(window.document.location.search.substr(1))
      if (queryString.id && queryString.verificationToken) {

        const postData = JSON.stringify({
          id: queryString.id,
          verificationToken: queryString.verificationToken
        })

        return $.ajax({
            type: 'POST',
            url: config.verifyRecipientUrl,
            // The key needs to match your method's input parameter (case-sensitive).
            data: postData,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data){
              console.log('Success', data)
            },
            failure: function(errMsg) {
              console.err('Error', errMsg);
            }
        })
      }
    },

    insertTableOfContents(selector) {
      const getTableOfContents = () => {
        const headers = document.querySelectorAll("h2, h3")
        let html = '<h2>Table of Contents</h2><ul class="contents-table"><li>'
        let lastTag = null

        for (let i = 0; i < headers.length ; i++) {
          const header = headers[i]

          if (!header.id) continue

          const text = header.textContent
          const link = header.id
          const currentTag = header.tagName

          if (currentTag === 'H2') {
            if (lastTag === 'H3') html += ' </ul>'
            if (lastTag === 'H2') html += ' </li>'
            html += `<li><a onClick='window.howdy.trackDocsClick("${text}")' href=#${link}>${text}</a>`
          }

          if (currentTag === 'H3') {
            if (lastTag === 'H2') html += '<ul>'
            html += `<li><a onClick='window.howdy.trackDocsClick("${text}")' href=#${link}>${text}</a></li>`
          }

          lastTag = header.tagName
        }

        if (lastTag === 'H3') html += ' </ul>'

        html += ' </li></ul>'

        return html
      }
      document.querySelector(selector).innerHTML = getTableOfContents()
    },

    trackDocsClick(name) {
      if (window.mixpanel) mixpanel.track('Viewed Docs Topic', { topic: name })
    }
  }
})

