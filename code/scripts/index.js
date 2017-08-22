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
    ReactDOM.render(<SnippetGenerator />, topSnippetGeneratorContainer)
  }

  if (bottomSnippetGeneratorContainer) {
    ReactDOM.render(<SnippetGenerator className="callout--dark" />, bottomSnippetGeneratorContainer)
  }

  if (snippetDisplayContainer) {
    ReactDOM.render(<SnippetDisplay />, snippetDisplayContainer)
  }

  if (liveDemoContainer) {
    ReactDOM.render(<LiveDemo />, liveDemoContainer)
  }

  window.howdy = {
    handleStartSubscription() {
      const queryString = parse(window.document.location.search.substr(1))
      const { verificationToken } = queryString

      if (window.$ && Stripe) {
        console.log('here', window.$.post)
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

            return $.ajax({
                type: 'POST',
                url: config.createSubscriptionUrl,
                // The key needs to match your method's input parameter (case-sensitive).
                data: postData,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(data){
                  return window.location.replace('https://howdyform.com/subscription-started.html')
                },
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

    handleDocsContent(selector) {
      const getTableOfContents = () => {
        let html = '<ul class="contents-table"><li>'
        let this_tag, last_tag, header, text, link
        const headers = document.querySelectorAll("h2, h3");
        for (let i = 0; i < headers.length ; i++)
        {
          header = headers[i]
          text = header.textContent
          link = header.id
          if (link == '') continue
          this_tag = header.tagName
          if (this_tag == 'H2') {
            if (last_tag == 'H3') html += ' </ul>'
            if (last_tag == 'H2') html += ' </li>'
              html += `<li><a onClick='window.howdy.trackDocsClick("${text}")' href=#${link}>${text}</a>`
          }
          if (this_tag == 'H3') {
            if (last_tag == 'H2') html += '<ul>'
            html += `<li><a onClick='window.howdy.trackDocsClick("${text}")' href=#${link}>${text}</a></li>`
          }
          last_tag = header.tagName
        }
        if (last_tag == 'H3') html += ' </ul>'
        html += ' </li></ul>'
        return html
      }
      document.querySelector(selector).innerHTML = getTableOfContents()
    },

    trackDocsClick(name) {
        if (window.mixpanel) {
          mixpanel.track('Viewed Docs Topic', {'topic': name})
          console.log("tracked")
        }
      }
  }
})
