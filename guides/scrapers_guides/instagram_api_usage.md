{
    "includeAboutSection": false,
    "usernames": [
        "ibrainglobal"
    ]
}

🚀 New feature: About profile. You can now scrape information about when the user joined Instagram, got verified, where they are from, or how many times they’ve changed the username. Available as a paid add-on. Try it out and share your feedback in a review!

What can Instagram Profile Scraper do?
Our Instagram Profile Scraper scrape data from public Instagram profiles beyond what the Instagram API allows. Just add one or more Instagram usernames, profile URLs, or profile IDs, and you're ready to:

👤 Extract Instagram data at scale from any public profile with no limits on requests

🌐 Get contact details, links, and websites, if listed in bio

✅ Categorize an account by type: business/private status, category, number of followers/follows, check verification, content stats, and join date

🪢 Map out related accounts to get a broader view of the niche

🎥 Get an overview of the most recent content and its stats – posts, videos, highlights reels, plus the latest 12 posts with details

⬇️ Download Instagram basic profile data in JSON, CSV, Excel, or other formats

🦾 Export posts data via SDKs (Python & Node.js), use API Endpoints & webhooks

🤳 Explore our other social media scrapers

You can use Instagram Profile Scraper to discover creators and businesses by analyzing bios, follower metrics, posting activity, and collecting any contact details or websites they’ve shared. Other options include market research and tracking competitors.

What data can I scrape from Instagram profiles?
Using this Instagram Profile API, you will be able to extract the following Instagram user data:

👤 Profile name	🔗 Profile URL	🆔 Profile ID	📝 Profile bio
🌐 External URLs (websites)	👥 Number of profile followers	➡️ Number of profile follows	🧑‍🤝‍🧑 Related profiles
📍 Location (if available)	🔁 Username change count	🕒 Join date	🆕 Is the user recently joined?
🎥 Total video count	📮 Total posts count	📚 Highlight reels count	🪪 Facebook ID
✅ Is user verified	⏱️ When the account got verified	💼 Is it a business or private account?	🏢 Business category
📷 Profile pic URL	📯 Latest image posts, carousels, and videos (12) with details	📽️ Number of IGTV videos	📈 Latest IGTV videos (12) with details
If you're not sure which profiles to extract data from, let's find them first. To find the right profiles to scrape for a niche, first use the keyword search by users in 🔗 Instagram Search Scraper. You can then reuse the resulting list as an input for Instagram Profile Scraper.

And another tip: since both Meta platforms users share a username, you can extract data from both Instagram and Threads at once. To do so, check out our 🔗 Threads Profile Scraper.

How to scrape data from Instagram profiles?
Instagram Profile Scraper is designed to be fast and easy to use, so there aren't too many parameters or settings. Just follow the steps below:

Create a free Apify account.
Open Instagram Profile Scraper.
Add one or multiple Instagram usernames, profile URLs, or profile IDs.
Click "Save & Start" and wait for the datasets to be extracted.
Download your data in JSON, XML, CSV, Excel, or HTML.
If you want more guidance on how to use Instagram Profile Scraper, here's a full video that explains it:



For more details, check out our tutorial on how to scrape data from Instagram, full of tips and tricks.

If you would like to scrape not only profile info but also profile's posts or reels — using usernames as input as well — go for our 🔗 Instagram Post Scraper or 🔗 Instagram Reels Scraper, respectively.

How much will scraping Instagram profiles cost you?
Instagram Profile Scraper works on our pay-per-result (PPR) model, meaning you’re charged for each result you receive. On the Free plan, the price is $2.60 per 1,000 results ($0.0026 per result), giving you nearly 2,000 results for free with the $5 credit.

On paid plans, you get discounted rates and more monthly credit. For example, on the Starter plan, it costs just $2.30 per 1,000 results, which lets you scrape almost 17,000 results per month. Check the pricing tab for full details.

⬇️ Input
To use this Instagram account scraper, enter either a profile URL, Instagram username, or profile ID. You can enter them one by one or all at once using the Bulk edit function.

Instagram Profile Scraper input
⬆️ Output
The results will be wrapped into a dataset, which you can find in the Storage tab. Here's an excerpt from the dataset you'd get if you apply the input parameters above:

Instagram Profile Scraper output
Besides the table view, you can also view your data as JSON, as well as download it as CSV, XML, Excel file, or through an API. Here’s an abridged version of the output for NASA’s profile.

👤 Extracted Instagram Profile data sample
You can export the data in common formats such as JSON, XML, CSV, or Excel. The JSON sample below is shortened for easier viewing. For details about extensive profile dataset, check the ❓FAQ.

[
	{
  "inputUrl": "https://www.instagram.com/nasa",
  "id": "528817151",
  "username": "nasa",
  "url": "https://www.instagram.com/nasa",
  "fullName": "NASA",
  "biography": "🚀 🌎  Exploring the universe and our home planet. Verification: nasa.gov/socialmedia",
  "about": {
    "accounts_with_shared_followers": null,
    "country": "United States",
    "date_joined": "August 2013",
    "date_joined_as_timestamp": 1375315200,
    "date_verified": null,
    "date_verified_as_timestamp": null,
    "former_usernames": 0,
    "id": 528817151,
    "is_verified": true,
    "username": "nasa"
  },
  "followersCount": 96323377,
  "followsCount": 80,
  "postsCount": 4519,
  "highlightReelCount": 7,
  "igtvVideoCount": 171,
  "isBusinessAccount": true,
  "joinedRecently": false,
  "hasChannel": false,
  "businessCategoryName": "Government Agencies",
  "private": false,
  "verified": true,
  "externalUrl": "https://www.nasa.gov/",
  "externalUrlShimmed": "https://l.instagram.com/?u=https%3A%2F%2Fwww.nasa.gov%2F&e=AT1ZDjgJaY0R3J_5BPBhAkOVzpnYahFjiPfJyjhlnLEYYuNsNcNWRb82YQFgO2KIr0y4-5RQxLwKrzkenyPD_X8lCwG1152r",
  "externalUrls": [
    {
      "title": "Launches & Landings",
      "lynx_url": "https://l.instagram.com/?u=http%3A%2F%2Fnasa.gov%2Fevents&e=AT3hgq2YyF3WlvjYHI2JwZbU2zCrM0mxkyXi6ng_rLM013yQVU42kfTDkEniCuGcLymBVrWAI63WDRN-mGG9ZI1iRN6E1Gza",
      "url": "http://nasa.gov/events",
      "link_type": "external"
    },
    {
      "title": "NASA+",
      "lynx_url": "https://l.instagram.com/?u=https%3A%2F%2Fplus.nasa.gov%2F&e=AT3MvU7lsdJzSS0VVs6unWL8xGF20bNKMeveMEAdPytH_L_Jrxjv2I1xGoawVT8PbKpLj4nteArXX001dmsvqfAKIks5kC-z",
      "url": "https://plus.nasa.gov",
      "link_type": "external"
    },
  ],
   "profilePicUrl": "https://scontent-lga3-2.cdninstagram.com/v/t51.2885-19/29090066_159271188110124_1152068159029641216_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=Gh65bXDHKlwQ7kNvwEfYy1t&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZHQIUQ7a4Apf3Of5gBsl8WIjOeYtUD5y5qsjSP0QTIaw&oe=68BDE429&_nc_sid=8b3546",
  "profilePicUrlHD": "https://scontent-lga3-2.cdninstagram.com/v/t51.2885-19/29090066_159271188110124_1152068159029641216_n.jpg?stp=dst-jpg_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=Gh65bXDHKlwQ7kNvwEfYy1t&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZy8pFx0aFMB6vCGqyOTixf4xcabDbR696Nk9So5zGS5A&oe=68BDE429&_nc_sid=8b3546",
  "relatedProfiles": [
    {
      "id": "953293389",
      "full_name": "International Space Station",
      "is_private": false,
      "is_verified": true,
      "profile_pic_url": "https://scontent-lga3-2.cdninstagram.com/v/t51.2885-19/524387219_18515253022013390_8734863048221656878_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4zNjAuYzIifQ&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=n5Q3j5RGpyUQ7kNvwEuQbjr&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfYdsrSuRePFjZmEZ1cVxFBbv8ZG6-5GBxUh0AjU08Imeg&oe=68BDB283&_nc_sid=8b3546",
      "username": "iss"
    },
    {
      "id": "15230646745",
      "full_name": "NASA en Español",
      "is_private": false,
      "is_verified": true,
      "profile_pic_url": "https://scontent-lga3-2.cdninstagram.com/v/t51.2885-19/89602193_2056296544517035_8140307827425017856_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=bmfcz6_-JfcQ7kNvwE6o78-&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZNjVvfjFKu1YoDP7FLfQL5VAK1SPK-5034xn0D0zKPmQ&oe=68BDC908&_nc_sid=8b3546",
      "username": "nasa_es"
    },
    {
      "id": "6372512764",
      "full_name": "Rubin Observatory",
      "is_private": false,
      "is_verified": false,
      "profile_pic_url": "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-19/129172974_838595436887238_6606102628994764123_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4zMjAuYzIifQ&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=auPF0Imwh6sQ7kNvwED04jo&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZ9C8VqyMuMVrOyKcG94AFFAwVlf1TI4PbEOJvUtIl-bw&oe=68BDDD5E&_nc_sid=8b3546",
      "username": "rubin_observatory"
    }
  ],
  "latestPosts": [
    {
      "id": "3697661021377407101",
      "type": "Sidecar",
      "shortCode": "DNQuxufAih9",
      "caption": "Under the sea🪸⁣\n ⁣\nIn 2020, @NASAHubble released this image, nicknamed the “Cosmic Reef,” to celebrate 30 years in space. It shows a giant red nebula and its smaller blue neighbor, which are both part of a vast star-forming region in the Large Magellanic Cloud, a satellite galaxy of the Milky Way, located 163,000 light-years away. In this picture, we can see how young, energetic, massive stars illuminate and sculpt their birthplace with powerful winds and searing ultraviolet radiation.⁣\n ⁣\nAt the heart of the big red nebula are sparkling stars, each of which are 10 to 20 times more massive than our Sun. The stars' ultraviolet radiation heats the surrounding dense gas. The massive stars also unleash fierce winds of charged particles that blast away lower-density gas, forming the bubble-like structures seen on the right, which resemble coral.⁣\n ⁣\nBy contrast, the seemingly isolated blue nebula at lower left was created by a solitary mammoth star 200,000 times brighter than our Sun. The blue gas was ejected by the star through a series of eruptive events during which it lost part of its outer envelope of material.⁣\n ⁣\nImage description: An image is split in two. In the bottom left of the first image a bright blue ring appears, slightly fading in all directions, with a small blue dot in the middle. Red and orange waves of gas ripple, arcing from top left to top right. A light blue center appears out of the sea of red, and several bright white dots shine through. In the top right, dark blue gas emanates from the blackness of space.⁣\n\nCredit: NASA, ESA, STScI⁣\n ⁣\n#NASA #Hubble #CoralReef #Nebula #Stars #Astronomy",
      "hashtags": [
        "NASA",
        "Hubble",
        "CoralReef",
        "Nebula",
        "Stars",
        "Astronomy"
      ],
      "mentions": [
        "NASAHubble"
      ],
      "url": "https://www.instagram.com/p/DNQuxufAih9/",
      "commentsCount": 1882,
      "dimensionsHeight": 1350,
      "dimensionsWidth": 1080,
      "displayUrl": "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-15/531774345_18540287185049152_7874995044152401858_n.jpg?stp=dst-jpg_e15_fr_p1080x1080_tt6&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=uQXBAI_7AhcQ7kNvwEwED5m&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzY5NzY2MDk2OTgzMjgwODA4NA%3D%3D.3-ccb7-5&oh=00_AfbdGmHsoImNQrhNUJOEaoE-JcaUbufJ6uLX8bzrlXfyug&oe=68BDD977&_nc_sid=8b3546",
      "images": [
        "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-15/531774345_18540287185049152_7874995044152401858_n.jpg?stp=dst-jpg_e15_fr_p1080x1080_tt6&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=uQXBAI_7AhcQ7kNvwEwED5m&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzY5NzY2MDk2OTgzMjgwODA4NA%3D%3D.3-ccb7-5&oh=00_AfbdGmHsoImNQrhNUJOEaoE-JcaUbufJ6uLX8bzrlXfyug&oe=68BDD977&_nc_sid=8b3546",
        "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-15/531284406_18540287176049152_5083951218943882291_n.jpg?stp=dst-jpg_e15_fr_p1080x1080_tt6&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=5yWvF2w3ZLUQ7kNvwGONSLu&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzY5NzY2MDk2OTAzNjUzMTMzMw%3D%3D.3-ccb7-5&oh=00_AfavyuwNnTr-45VBGBJzrY4h8QX9eIK3zzQQqtnmeMDULg&oe=68BDAFF6&_nc_sid=8b3546"
      ],
      "alt": "Photo by NASA on August 12, 2025. May be an image of text.",
      "likesCount": 601022,
      "timestamp": "2025-08-12T16:19:28.000Z",
      "childPosts": [
        {
          "id": "3697660969832808084",
          "type": "Image",
          "shortCode": "DNQuw-etf6U",
          "caption": "",
          "hashtags": [],
          "mentions": [],
          "url": "https://www.instagram.com/p/DNQuw-etf6U/",
          "commentsCount": 0,
          "firstComment": "",
          "latestComments": [],
          "dimensionsHeight": 1350,
          "dimensionsWidth": 1080,
          "displayUrl": "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-15/531774345_18540287185049152_7874995044152401858_n.jpg?stp=dst-jpg_e15_fr_p1080x1080_tt6&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=uQXBAI_7AhcQ7kNvwEwED5m&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzY5NzY2MDk2OTgzMjgwODA4NA%3D%3D.3-ccb7-5&oh=00_AfbdGmHsoImNQrhNUJOEaoE-JcaUbufJ6uLX8bzrlXfyug&oe=68BDD977&_nc_sid=8b3546",
          "images": [],
          "alt": "Photo by NASA on August 12, 2025. May be an image of text.",
          "likesCount": null,
          "timestamp": null,
          "childPosts": [],
          "ownerUsername": "nasa",
          "ownerId": "528817151"
        },
        {
          "id": "3697660969036531333",
          "type": "Image",
          "shortCode": "DNQuw9vP8aF",
          "caption": "",
          "hashtags": [],
          "mentions": [],
          "url": "https://www.instagram.com/p/DNQuw9vP8aF/",
          "commentsCount": 0,
          "firstComment": "",
          "latestComments": [],
          "dimensionsHeight": 1350,
          "dimensionsWidth": 1080,
          "displayUrl": "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-15/531284406_18540287176049152_5083951218943882291_n.jpg?stp=dst-jpg_e15_fr_p1080x1080_tt6&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=5yWvF2w3ZLUQ7kNvwGONSLu&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzY5NzY2MDk2OTAzNjUzMTMzMw%3D%3D.3-ccb7-5&oh=00_AfavyuwNnTr-45VBGBJzrY4h8QX9eIK3zzQQqtnmeMDULg&oe=68BDAFF6&_nc_sid=8b3546",
          "images": [],
          "alt": "Photo by NASA on August 12, 2025. May be an image of text.",
          "likesCount": null,
          "timestamp": null,
          "childPosts": [],
          "ownerUsername": "nasa",
          "ownerId": "528817151"
        }
      ],
      "ownerUsername": "nasa",
      "ownerId": "528817151",
      "isPinned": true,
      "isCommentsDisabled": false
    },
    {
      "id": "3673013061754164654",
      "type": "Image",
      "shortCode": "DL5KetROhWu",
      "caption": "At NASA, we’re redefining the mirror selfie.⁣\n⁣\nAstronaut Zena Cardman pauses to inspect her spacesuit’s wrist mirror, a small but crucial tool for reading suit displays and controls. This portrait, taken at @NASAJohnson in Houston, Texas, shows one of the many small moments of preparation in an astronaut’s journey to spaceflight.⁣\n⁣\nCardman, a Virginia native, is gearing up for her first spaceflight to the International Space Station as part of our SpaceX Crew-11 mission, scheduled to launch later this summer. Selected in the “Turtles” astronaut class of 2017, she has a research background in geobiology, with degrees in biology and marine sciences from the University of North Carolina, Chapel Hill.⁣\n⁣\nHer experience includes multiple expeditions to Antarctica as part of her studies of life in extreme environments like caves and deep-sea sediments. Now, she’s taking on the next frontier.⁣\n⁣\nThis photo was one of NASA’s 2024 Photos of the Year, capturing the calm determination required in every moment of an astronaut’s training—even routine spacesuit checks.⁣\n⁣\nImage description: Astronaut Zena Cardman wears a white spacesuit and looks down while adjusting a small mirror on her wrist, attached to her left glove. She is photographed against a dark background at Johnson Space Center.⁣\n⁣\nCredit: NASA/Josh Valcarcel⁣\n⁣\n#NASA #Astronaut #SpaceX #NASAPhotoOfTheYear #MirrorSelfie",
      "hashtags": [
        "NASA",
        "Astronaut",
        "SpaceX",
        "NASAPhotoOfTheYear",
        "MirrorSelfie"
      ],
      "mentions": [
        "NASAJohnson"
      ],
      "url": "https://www.instagram.com/p/DL5KetROhWu/",
      "commentsCount": 521,
      "dimensionsHeight": 719,
      "dimensionsWidth": 1080,
      "displayUrl": "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-15/516513244_18534178162049152_7010594162229503875_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08_tt6&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=GwXFdCq9-AcQ7kNvwHYp_CU&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzY3MzAxMzA2MTc1NDE2NDY1NA%3D%3D.3-ccb7-5&oh=00_AfaCj1mF0R0FVaJjPlozo5z_xcgBjcSZ9kGNwSrOpNKoJA&oe=68BDC66A&_nc_sid=8b3546",
      "images": [],
      "alt": "Photo by NASA on July 09, 2025. May be an image of 1 person, glasses, gas mask and text.",
      "likesCount": 174591,
      "timestamp": "2025-07-09T16:08:25.000Z",
      "childPosts": [],
      "ownerUsername": "nasa",
      "ownerId": "528817151",
      "isPinned": true,
      "isCommentsDisabled": false
    },
    {
      "id": "3710009743416087462",
      "type": "Video",
      "shortCode": "DN8mjSFjdOm",
      "caption": "We’re going up, up, up, it’s our moment! 🎶 \n\nThe Nancy Grace Roman Space Telescope, which will unveil the cosmos in ways never before possible, has passed its deployment test at @NASAGoddard. The test ensures Roman’s solar panels and deployable aperture cover will unfold as planned in space.\n\nRoman, which will look for planets beyond our solar system and study essential questions in dark energy and astrophysics, is scheduled to lift off no later than May 2027 with the team aiming for as early as fall 2026.\n\nCheck out the link in @NASAUniverse’s Roman story highlight to learn more! \n\nVideo description is in the comments.\n\nVideo credit: NASA Goddard Space Flight Center \n\nMusic credit: “History in Motion” by Fred Dubois [SACEM], Koka Media [SACEM], Universal Publishing Production Music France [SACEM], and Universal Production Music\n\n#NASARoman #Astrophysics #SpaceTelescope",
      "hashtags": [
        "NASARoman",
        "Astrophysics",
        "SpaceTelescope"
      ],
      "mentions": [
        "NASAGoddard.",
        "NASAUniverse’s"
      ],
      "url": "https://www.instagram.com/p/DN8mjSFjdOm/",
      "commentsCount": 429,
      "dimensionsHeight": 853,
      "dimensionsWidth": 480,
      "displayUrl": "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-15/540339845_18543281020049152_374907486710299024_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=BI6ApvowgkAQ7kNvwFHMRMF&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfaqzI2_uxUQzYx9wP5NePb9Dkx7aIMsHkPLp1Ckzpg2lw&oe=68BDC0BC&_nc_sid=8b3546",
      "images": [],
      "videoUrl": "https://scontent-lga3-2.cdninstagram.com/o1/v/t16/f2/m86/AQNgItj-I8c54F4JITtRKe96uTNaCh-jff0yVYtRQnctHNVjYHSK6k_5F1T8wjlcX07D0JbkKdZVT9CVgGIaIfYf60ILBtAnoEDfb7M.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2xpcHMuYzIuNzIwLmJhc2VsaW5lIn0&_nc_cat=105&vs=1710745592912059_790277742&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC8wMTQwMTA2MERBQTU1ODc1ODc1NkQwMDBDM0EzNTI5Nl92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HTHpBSXlBUDdLYndFekVGQUxwUXUwREQ1SklsYnFfRUFBQUYVAgLIARIAKAAYABsAFQAAJoKzhJGV5KZAFQIoAkMzLBdAU4zMzMzMzRgSZGFzaF9iYXNlbGluZV8xX3YxEQB1%2Fgdl5p0BAA%3D%3D&ccb=9-4&oh=00_AfYaF22OWN5DNeufbo4E5PxQbU8f7Z01w_ZcF7TQjo5JVQ&oe=68B9E893&_nc_sid=8b3546",
      "alt": null,
      "likesCount": 53833,
      "videoViewCount": 926847,
      "timestamp": "2025-08-29T17:16:11.000Z",
      "childPosts": [],
      "ownerUsername": "nasa",
      "ownerId": "528817151",
      "productType": "clips",
      "taggedUsers": [
        {
          "full_name": "NASA Goddard",
          "id": "3808579",
          "is_verified": true,
          "profile_pic_url": "https://scontent-lga3-2.cdninstagram.com/v/t51.2885-19/259425979_4763874963660268_347188873176140064_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=Wp6boRbLcVEQ7kNvwGB9Csp&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZPE3Jd7W_Qv9C2N1BQX0bvP4iibV_HGSegnj4PgnA3yw&oe=68BDDA14&_nc_sid=8b3546",
          "username": "nasagoddard"
        },
        {
          "full_name": "NASA Universe",
          "id": "65495240044",
          "is_verified": true,
          "profile_pic_url": "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-19/437785305_1498177207718392_5285428334541669140_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=Uaqg3YE86UoQ7kNvwEIACEK&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZ5q2ixACuwomqFYKDV0ohM6F28V920cxWzzt71zGxXWw&oe=68BDCDE6&_nc_sid=8b3546",
          "username": "nasauniverse"
        }
      ],
      "isCommentsDisabled": false
    },
    {
      "id": "3704177173242037885",
      "type": "Image",
      "shortCode": "DNn4YN0M8Z9",
      "caption": "Some people look up at clouds and see an elephant; some satellites look down at ice and spot a smiley face. 😊\n \nThis friendly pattern of cobalt blue water – toward the bottom of this satellite image, left of center – formed as snow and ice melted on the surface of the Greenland ice sheet earlier this summer.\n \nMelt ponds typically begin to dot the edges of the ice sheet in the spring, growing and occasionally connecting in a network of bright blue rivers and pools. The ponded water can drain through cracks in the ice sheet, and if it reaches bedrock at the base of the ice sheet can temporarily speed up the flow of ice toward the coast.\n \nThis true-color image was taken by the Landsat 9 satellite as it passed over western Greenland on July 2, 2025.\n \nHave a (n)ice day!\n \nImage description: Bright blue pools of water dot the white background of the Greenland ice sheet. There are some irregular shaped larger pools that are filled with water, but most of the features in the image appear as outlines, with water surrounding a bit of ice. In the bottom center of the image, two small melt ponds stand out at each edge of a curved line, with those features encircled by another melt pond, creating a smiling face pattern. \n \nCredit: NASA/USGS Landsat\n \n#NASA #Earth #Greenland #Meltponds #SmileyFace",
      "hashtags": [
        "NASA",
        "Earth",
        "Greenland",
        "Meltponds",
        "SmileyFace"
      ],
      "mentions": [],
      "url": "https://www.instagram.com/p/DNn4YN0M8Z9/",
      "commentsCount": 444,
      "dimensionsHeight": 719,
      "dimensionsWidth": 1080,
      "displayUrl": "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-15/537496610_18541843609049152_667922901239589885_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08_tt6&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=rfqLldfUiaMQ7kNvwGnDBJs&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzcwNDE3NzE3MzI0MjAzNzg4NQ%3D%3D.3-ccb7-5&oh=00_Afbe1pn4MfVJKVF2hJ4JcIIKY7CzTKwUpYeIFimpWQacmA&oe=68BDD7BE&_nc_sid=8b3546",
      "images": [],
      "alt": "Photo by NASA on August 21, 2025. May be an image of text.",
      "likesCount": 216938,
      "timestamp": "2025-08-21T16:05:55.000Z",
      "childPosts": [],
      "ownerUsername": "nasa",
      "ownerId": "528817151",
      "isCommentsDisabled": false
    },
      "latestIgtvVideos": [
    {
      "type": "Video",
      "shortCode": "CqnzfuxpAKL",
      "title": "",
      "caption": "On April 3, we announced the team of space explorers that will embark on the first crewed Artemis mission around the Moon and back in 2024: @NASAAstronauts Reid Wiseman, @AstroVicGlover, and @Astro_Christina, and @CanadianSpaceAgency astronaut @AstroJeremy. Today, they’re taking your questions live. \r \rIn 2022, the uncrewed Artemis I mission successfully tested our deep exploration systems — SLS, Orion, and @NASAKennedy’s Exploration Ground Systems — with a 25.5-day journey around the Moon and back to Earth. Artemis II will launch the Orion spacecraft aboard the Space Launch System (SLS) rocket on a 10-day mission to test the Orion spacecraft’s life-support systems. \r \rWith #Artemis, we will land the first woman and first person of color on the lunar surface. \r \rThumbnail image credit: NASA/Josh Valcarcel \r \r#NASA #Moon #LunarMission #Astronaut #CSA #SpaceLaunchSystem #Orion #NASAKennedy #artemis",
      "commentsCount": 2378,
      "commentsDisabled": false,
      "dimensionsHeight": 1920,
      "dimensionsWidth": 1080,
      "displayUrl": "https://scontent-lga3-3.cdninstagram.com/v/t51.29350-15/339186499_173726455535874_7041676884942695648_n.jpg?se=7&stp=dst-jpg_e35_tt6&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=7OCX-IbqGZIQ7kNvwEiyfDa&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZWcfTe2kEx-LDWVvyD9qgo6yvKUVF6zqOU6Jo-DQLXug&oe=68BDAEE7&_nc_sid=8b3546",
      "likesCount": 330976,
      "videoDuration": 1122.054,
      "videoViewCount": 2430081,
      "id": "3073651751604454027",
      "hashtags": [
        "Artemis,",
        "NASA",
        "Moon",
        "LunarMission",
        "Astronaut",
        "CSA",
        "SpaceLaunchSystem",
        "Orion",
        "NASAKennedy",
        "artemis"
      ],
      "mentions": [
        "NASAAstronauts",
        "AstroVicGlover,",
        "Astro_Christina,",
        "CanadianSpaceAgency",
        "AstroJeremy.",
        "NASAKennedy’s"
      ],
      "url": "https://www.instagram.com/p/CqnzfuxpAKL/",
      "firstComment": "",
      "latestComments": [],
      "images": [],
      "videoUrl": "https://scontent-lga3-3.cdninstagram.com/o1/v/t16/f2/m69/AQM43ZTzFdUhnFnNebJcWDTBR8GQDnOCv_XcJOQekgeiehMD4FlTRSJYobJsnbmJ3DoQwf9PniHcNoumh3UOlnq_.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uaWd0di5jMi43MjAuYmFzZWxpbmUifQ&_nc_cat=110&vs=807723887881714_3189018764&_nc_vs=HBksFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HSUNXbUFERlpsTDRhZFVFQUJyRXJ4dS02TWRwYnFDQkFBQUYVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HTmptQmhxSUpQR244OVFEQUpqMmhxTC1vSFE5YnFDQkFBQUYVAgLIARIAKAAYABsBiAd1c2Vfb2lsATEVAAAmoKyRs4L58T8VAigCQzMsF0CRiDdLxqfwGBJkYXNoX2Jhc2VsaW5lXzFfdjERAHXsB2XsnQEA&ccb=9-4&oh=00_AfY6G5jD3sqZG6k-ZFnmZPey0js10VMD4mr5vGYq_8cUgw&oe=68B9CE11&_nc_sid=8b3546",
      "alt": null,
      "timestamp": "2023-04-04T17:04:37.000Z",
      "childPosts": [],
      "ownerUsername": "nasa",
      "ownerId": "528817151",
      "productType": "igtv",
      "taggedUsers": [
        {
          "full_name": "NASA",
          "id": "528817151",
          "is_verified": true,
          "profile_pic_url": "https://scontent-lga3-2.cdninstagram.com/v/t51.2885-19/29090066_159271188110124_1152068159029641216_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=Gh65bXDHKlwQ7kNvwEfYy1t&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZHQIUQ7a4Apf3Of5gBsl8WIjOeYtUD5y5qsjSP0QTIaw&oe=68BDE429&_nc_sid=8b3546",
          "username": "nasa"
        },
        {
          "full_name": "NASA Artemis",
          "id": "1104426670",
          "is_verified": true,
          "profile_pic_url": "https://scontent-lga3-2.cdninstagram.com/v/t51.2885-19/243060603_348004860384021_2397564104194509360_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=109&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=RtgB0GnS5psQ7kNvwFIvpT-&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZePAc9tsK9CW_DYiznG2pGsneu-cJ3rEyWvPBTRy-lfQ&oe=68BDD9A4&_nc_sid=8b3546",
          "username": "nasaartemis"
        },
        {
          "full_name": "NASA’s Johnson Space Center",
          "id": "673882723",
          "is_verified": true,
          "profile_pic_url": "https://scontent-lga3-3.cdninstagram.com/v/t51.2885-19/11421977_902607023152688_677352411_a.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xNTAuYzIifQ&_nc_ht=scontent-lga3-3.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=obarzbHEcKEQ7kNvwHjAzFt&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfZI5Bh5wlVQvN511QOnYKjAEK6CkAtuLQc7FDNYPSzk8w&oe=68BDDC10&_nc_sid=8b3546",
          "username": "nasajohnson"
        },
        {
          "full_name": "NASA Astronauts",
          "id": "8328756214",
          "is_verified": true,
          "profile_pic_url": "https://scontent-lga3-1.cdninstagram.com/v/t51.2885-19/503939840_18271007971276215_6035321566360967661_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby41MDAuYzIifQ&_nc_ht=scontent-lga3-1.cdninstagram.com&_nc_cat=103&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=cic2fKTMyTAQ7kNvwGLYyyW&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfY7zB1FSoeRRNFmMks1m2pNJOl2j9klQ3lMQghA8PseyQ&oe=68BDD969&_nc_sid=8b3546",
          "username": "nasaastronauts"
        },
        {
          "full_name": "Canadian Space Agency",
          "id": "3517229058",
          "is_verified": true,
          "profile_pic_url": "https://scontent-lga3-2.cdninstagram.com/v/t51.2885-19/335793446_121583980771113_4538780798561187899_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=109&_nc_oc=Q6cZ2QEWnPDliR8l8O8O6lrq-a6UQkmkKfPOZ27sjRSLF1eSNuG_DZx7QTwof5IFZW-nYOQ&_nc_ohc=ua_abD9s2oAQ7kNvwGw1EtK&_nc_gid=AZnTjfD_Q7X_TSnVbEhOGA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfYmR8vtQ5TmbgaUYbwnF-P5wmwi8lsXd6To5edN-eDGTQ&oe=68BDB03A&_nc_sid=8b3546",
          "username": "canadianspaceagency"
        },
      ],
      "isCommentsDisabled": false
    },
  ],
  ]

Want to get other details from an Instagram account?
You can use the other dedicated scrapers below if you want to scrape specific Instagram data:

📷 Instagram Post Scraper	💬 Instagram Comments Scraper
✅ TikTok Profile Scraper	🎞️ Instagram Reel Scraper
#️⃣ Instagram Hashtag Scraper	🔢 Instagram Related Hashtag Stats Scraper
👥 Instagram Followers Count Scraper	🏷️ Instagram Mentions Scraper
🏋️‍♀️ Instagram Topic Scraper	💾 Export Instagram Comments and Posts Tool
If you're comfortable with more complex settings, use our more advanced 🔗 Instagram Scraper or 🔗 Instagram API Scraper. They cover almost all functionalities of the dedicated scrapers.

❓FAQ
What's the expected size of the Instagram Profile dataset?
Note that the dataset can become extensive due to sections like relatedProfiles, latestPosts, and latestIgtvVideos. If you only need key metrics and contact information from scraped Instagram profiles, you can exclude these fields in Storage > Dataset > Export dataset > Omit fields.

What if I only need very basic profile info from Instagram account?
In case you need to scrape only basic profile info, such as followers count, following count, and the last time the account posted, you can use 👥 Instagram Followers Count Scraper. It is more optimized for a specific use case like this.

Can I get Instagram details by username?
Yes. All you need is the profile’s username, and the scraper will fetch all available public data from that account. This includes metrics like followers, follows, posts, engagement, and profile contact details, so you don’t need anything more than the username to start.

Can I get Instagram details by URL or ID?
Yes. Simply provide the profile’s URL or ID, and the scraper will extract the same set of public data as it would with a username. Using URLs can be especially handy if you already have a list of Instagram profiles from another source and want to process them directly.

Is it legal to scrape Instagram profiles?
Our Instagram scrapers do not extract any private user data, such as email addresses, gender, or location. They only extract what the user has chosen to share publicly.

However, you should be aware that your results could contain personal data. Personal data is protected by the GDPR in the European Union and by other regulations around the world. You should not scrape personal data unless you have a legitimate reason to do so. If you're unsure whether your reason is legitimate, consult your lawyers. You can also read our blog post on the legality of web scraping.

Can I use integrations with Instagram Profile Scraper?
You can integrate profile data scraped from Instagram with almost any cloud service or web app. We offer integrations with Zapier, n8n, Slack, Make, Airbyte, Gumloop, CrewAI, IFTTT, Lindy, GitHub, Google Sheets, Google Drive, and plenty more.

Alternatively, you could use webhooks to carry out an action whenever an event occurs, such as getting a notification whenever the Instagram Profile Scraper successfully finishes a run.

Can I use this Instagram data extractor with the Apify API?
Yes. The Apify API gives you programmatic access to the Apify platform. The API is organized around RESTful HTTP endpoints that enable you to manage, schedule, and run Apify Actors. Meaning the API will let you access any datasets, monitor actor performance, fetch scraped profile results, create and update versions, and more.

To access the API using Node.js, use the apify-client NPM package. To access the API using Python, use the apify-client PyPI package. Check out the Apify API reference docs for all the details.