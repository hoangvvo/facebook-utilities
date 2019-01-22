# facebook-utilities

A browser extension that improves your experience on Facebook with an all-in-one solution. Facebook Utilities provides security, privacy and a wide range of functionalities: **Friend Interaction Analysis**, **Who unfriend me**, **Block 'seen' and 'typing'**,...

## Features

- Interaction Analysis: ranks your friend based on their interactions with the content on your Facebook timeline
- Privacy changer: changes the privacy settings of all your posts in one click
- Who unfriend me: allows you to know who unfriend you
- Messenger Center: Message counts and download all messages from your friends
- Profile Picture Guard: helps protect your profile picture against bad people
- Block "seen" and "typing": disable seen and typing indicator in chat and comment
- Facebook timer: track the time you spend on Facebook
- Facebook Stayfocus: limit your time spent on Facebook to help you stay on track

## How does it work

The application extracts your Facebook access token **(!?)** and helps you accomplish several tasks on your behalf by making API requests to Facebook's endpoints. 
**Fear not! Everything is done client-side. No access token is sent to anywhere else except Facebook itself. Do not trust me? See the source code!**

## Security measures

I understand that access token must be dealt with care. That's the reason I have implemented security measures to prevent it from being leaked. Your access token is saved in the application memory while it is running. After you close your browser, I remove it from memory. This ensures the security for your facebook account.

## License

[AGPL-3.0](LICENSE)

To provide transparency, if you make use of this project in yours, you need disclose your source code. Furthurmore, your user should have access to the source code.

You **MUST** not use this program or its source code for dishonor purposes, such as *manipulating* or *taking control* of Facebook account.
