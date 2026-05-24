## Goal

Implement a new layout for the cv page to improve user experience, based on mockups.

## Mockup 1

Implement new scrolling functionality for the CV page.
Mockup reference: ./cv-page-scrolling.png.

New layout includes 3 main panels: top - header, left - edit form, right - preview.

Vertical page size is fixed at 100vh.

Header has a fixed position at the top and is always visible.

Left and right panels have independent scrolls.

Arrows and page numbers are fixed in the bottom part of the preview and always visible. They are shown in the referenced image as well.

## Mockup 2

Implement left side menu, move buttons to header.
Mockup reference: ./cv-page-left-side-menu.png

Left side menu:

- is hidden by default
- is opened by clicking on the burger menu (9 dots in the top left corner)
- when the menu is opened it overlaps the left side of the app along its whole height. The rest of the app area is overlapped by a gray overlay.
- the menu is closed when we click on the gray overlay
- the menu consists of
  - Logo (just app title "CV Generator")
  - User icon + user name
  - Link to landing page, has label "Main"
  - Link to cv list "My Resumes"
  - Empty link to "Cover letters" (Cover letters is not implemented yet)
  - Link to the GitHub account of the app. It's displayed as a GitHub link at the bottom of the menu

Buttons:

- Move the button for CV title editing to the header, to the left side.
- Create dropdown "Theme" for theme selection (without functionality for now) and put it in the header.
- Move download functionality to a dropdown in the header next to the Theme dropdown

## Mockup 3

Adapt new CV page layout for mobile.
Mockup reference: ./cv-page-mobile.png

Header:

- All buttons from desktop are hidden
- Download button is moved to the bottom as a fixed button
- Add Preview button to header
  - When the user clicks on the button, the label is changed to Edit
  - Editor form is hidden
  - Preview is shown
  - Theme button is shown to the left of the Download button

Mobile layout for Download and Theme buttons:

- When the user clicks on the Download or Theme buttons, a gray overlay overlaps the entire screen
- Options from the dropdown are displayed under the button as a list
- Functionality is the same as on desktop

## Mockup 4

Implement new layout for CV list.
Mockup reference: ./cv-list.png

The layout globally consists of two parts: left side menu and My resumes. The header is omitted.

Left side menu:

- It generally looks like the one on the CV page with minor changes
- It is permanently visible, there is no way to hide it
- It takes the whole screen height
- It doesn't overlap the app but shifts it

List of resumes:

- Headline contains
  - Title My resumes
  - New button

- New button consists of two parts
  - Main part - just a button. When the user clicks on it, a new CV is created and the user is redirected to the CV page.
  - "v" icon - it works as a dropdown with two options "Create" and "Upload JSON"

- CV list (My resumes)
  - Is displayed as a card list in 3 columns (adapted depending on screen size)
  - Every card has
    - Name of CV
    - Created at: xx.xx.xxxx
    - Download PDF button
    - Copy button - creates a copy of the CV with name "Original cv title-copy"
    - Remove button
    - Download PDF, Copy button, Remove button have icons as on the mockup

## Mockup 5

Adapt new CV list layout to mobile devices.
Mockup reference: ./cv-list-mobile.png

Header:

- It is added for mobile devices
- Contains
  - Button to open left side menu like on the CV page
  - New button with "v" dropdown as it was on desktop in the heading

Left side menu:

- is hidden on mobile devices
- it's opened by clicking on the burger button like on the CV page
- see the mockup for details

# Technical details

- Use lucide for icons
- Keep design consistent across the entire app
- Reuse UI elements like button, dropdown, menu and so on.
- Keep code clean and readable