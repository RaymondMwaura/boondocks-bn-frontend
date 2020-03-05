import React from "react";
import { fireEvent, render, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { SettingsPage } from "../../views/settings/SettingsPage";
import { BrowserRouter } from "react-router-dom";

describe("<SettingsPage />", () => {
  it("should render the page", async () => {
    const props = {
      verify2FactorAuth: jest.fn(),
      disable2FactorAuth: jest.fn(),
      get2FactorAuth: jest.fn(),
      sendFATokenText: jest.fn(),
      set2FactorAuth: jest.fn(),
      authState: {
        isAuthenticated: true,
        isTokenValid: true,
        twoFAType: "authenticator_app",
        twoFASecret: "F5KHKO3LJ5EGWKCEOZLW2N2LF5THEJBJ",
        twoFADataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAADECAYAAADApo5rAAAAAklEQVR4AewaftIAAAjMSURBVO3BQYolyZIAQdUg739lneIvHFs5BO9ldfdgIvYHa63/eVhrHQ9rreNhrXU8rLWOh7XW8bDWOh7WWsfDWut4WGsdD2ut42GtdTystY6HtdbxsNY6HtZaxw8fUvmbKiaVqeJG5aZiUnmj4t9MZap4Q+WmYlL5myo+8bDWOh7WWsfDWuv44csqvknlmyomlW9SmSreUHmj4kZlqphUbiqmik9UfJPKNz2stY6HtdbxsNY6fvhlKm9UvFExqUwVn6i4UZkqJpVvqrhR+UTF36TyRsVvelhrHQ9rreNhrXX88B+nMlVMKjcVNyo3Ff8klaniRuUNlani/7OHtdbxsNY6HtZaxw//cRWfUJkqbiomlU9U/Jeo3FT8lz2stY6HtdbxsNY6fvhlFX+TylRxo/KGylRxo/KbKiaVqWKquFH5myr+TR7WWsfDWut4WGsdP3yZyt+kMlVMKlPFJyomlanipmJSmSomlaliUpkqJpWpYlKZKiaVqWJSeUPl3+xhrXU8rLWOh7XW8cOHKv5NVG5UPqEyVUwqv0nlN6m8UXFT8V/ysNY6HtZax8Na6/jhQypTxaRyUzGpvFExqUwVk8pUMalMFZPKGxWTylQxqUwVn6i4qZhUpopPqEwVNypTxaRyU/GJh7XW8bDWOh7WWscP/3IVk8qkMlW8oTJVTCo3KlPFb1KZKj6hMlVMKjcVn1C5UfmbHtZax8Na63hYax32B1+k8l9SMalMFW+o3FRMKlPFpHJTcaMyVdyo3FRMKlPFpDJV3KhMFX/Tw1rreFhrHQ9rreOHL6t4Q2WqeEPlb1KZKqaKSWVSeaNiUrlR+UTFpHJTcVMxqdxU/JMe1lrHw1rreFhrHT98mcpUMam8ofJGxY3KGypTxaRyU/EJlaniEypTxaRyo/KJihuVT1R84mGtdTystY6HtdZhf/BFKjcVk8pUcaMyVXyTylTxhspNxY3KGxWfUHmj4hMqU8WkMlXcqEwVn3hYax0Pa63jYa11/PAhlanijYoblaniRmWqeKNiUrmpmCq+qeJGZaq4UXmjYlKZKiaVm4qbikllqvhND2ut42GtdTystY4ffpnKGxVTxRsVk8pUcaNyUzGpTBU3Kr9JZaqYKiaVqWJSeaPiRuWNiknlNz2stY6HtdbxsNY67A9+kcpUcaPyRsWkMlVMKlPFGyp/U8Wk8k0VNypTxaRyU3GjMlX8kx7WWsfDWut4WGsdP3xI5ZsqvknlmyomlTcqJpWp4hMVNyqTylQxVXyTylRxozJV/KaHtdbxsNY6HtZaxw9fVjGpTCpTxY3KTcVU8YbKGxVvVLyhMlVMFZPKpPJNKlPFTcUbKlPFP+lhrXU8rLWOh7XWYX/wF6lMFW+o3FR8QuUTFd+kMlVMKm9UTCo3FW+oTBWTylQxqdxUTCpTxSce1lrHw1rreFhrHT98mcpNxaTyRsWkcqMyVXyi4g2VqWJSmSpuVD6hclNxozJVTBWTylQxqbyhMlV808Na63hYax0Pa63D/uAXqUwVf5PKGxU3KjcVk8pNxaTyRsWkMlXcqHyi4kZlqviEyk3FJx7WWsfDWut4WGsd9gdfpPJGxaRyUzGpvFFxozJV/CaV31TxCZWpYlJ5o2JS+UTFNz2stY6HtdbxsNY6fviyikllqnijYlK5qZhUblSmihuVqeINlZuKSeWmYlKZVN6ouFGZKiaVqWJSmSpuVKaK3/Sw1joe1lrHw1rrsD/4gMobFZPKGxWTyk3FpDJVTCpvVEwqNxWTylQxqUwVb6h8ouJGZar4TSpTxTc9rLWOh7XW8bDWOn74y1RuKj5RcVPxRsWk8gmVqeKm4kZlqvgmlTdUbipuVN5QmSo+8bDWOh7WWsfDWuuwP/iAylRxo/KJik+oTBU3KlPFpHJTMal8omJSeaPiRmWqmFSmijdU3qiYVG4qPvGw1joe1lrHw1rr+OFDFTcqU8WNylQxqXyi4kZlqphUporfVPFGxaRyozJVTCpTxY3KGxWTyk3FpPJND2ut42GtdTystY4fPqRyU/EJlTcqblTeUJkq3lC5qZhUblSmikllqphU3qiYVN6omFQmlX+Th7XW8bDWOh7WWof9wRepfFPFjcpUMalMFZPKTcWNylRxozJV3KhMFZPKVPGGylQxqUwVNypvVNyo3FR808Na63hYax0Pa63D/uADKlPFjcpUcaMyVdyofKJiUpkqJpWp4g2Vb6q4UbmpuFGZKt5QeaPib3pYax0Pa63jYa11/PChihuVqeKNit9UMalMFZPKjcpU8U0Vk8qNylRxo3JT8U0Vk8qkclPxTQ9rreNhrXU8rLWOH75MZaqYVKaKSeWNipuKSWVSeaNiUpkqJpWbijdUpoq/SeWbVD6hMlV84mGtdTystY6HtdZhf/AfpjJVvKFyU/FvonJTMalMFTcqU8WNylTxhspUcaMyVXzTw1rreFhrHQ9rreOHD6n8TRU3KlPFTcUnVG4q3lC5qfhNFZPKJ1SmihuVqeJvelhrHQ9rreNhrXX88GUV36TyCZWp4kblExWTyjepTBWTyidUpooblZuKNypuKiaVqeITD2ut42GtdTystY4ffpnKGxVvVEwqU8Wk8omKT1RMKm9U3FTcqNxUfELlm1RuKr7pYa11PKy1joe11vHDf5zKVDGp3FRMKlPFpPIJlTcqblSmik+oTBWTylQxqUwVk8qNyk3Fb3pYax0Pa63jYa11/PD/XMVvqphUpopJ5Z9UMalMFZPKGxVvVEwqU8WkclPxiYe11vGw1joe1lrHD7+s4jdV3Ki8UXFTMam8UTGp3KhMFVPFGypTxSdUbiqmikllqnij4pse1lrHw1rreFhrHT98mcrfpDJV3FR8QmWq+JtUpopJZaqYKj5RMalMFZPKTcWkMlX8TQ9rreNhrXU8rLUO+4O11v88rLWOh7XW8bDWOh7WWsfDWut4WGsdD2ut42GtdTystY6HtdbxsNY6HtZax8Na63hYax0Pa63j/wChoruTFwDh8AAAAABJRU5ErkJggg==",
        phoneNumber: "+2507888888888"
      }
    };

    const { getByTestId, findByText } = render(
      <BrowserRouter>
        <SettingsPage {...props} />
      </BrowserRouter>
    );

    // Go to settings page
    const twoFAMenu = getByTestId("two-fa-menu");
    fireEvent.click(twoFAMenu);

    const twoFAPage = getByTestId('two-fa-page');
    expect(twoFAPage).toBeInTheDocument();

    // SMS Text Method
    const smsTextRadio = getByTestId("sms_text_radio");
    expect(smsTextRadio).toBeInTheDocument();
    fireEvent.click(smsTextRadio);

    const proceedBtn = getByTestId("proceed_btn");
    expect(proceedBtn).toBeInTheDocument();
    fireEvent.click(proceedBtn);

    const smsTextInput = await waitForElement(() => getByTestId("token_input"));
    expect(smsTextInput).toBeInTheDocument();
    expect(smsTextInput).toBeDisabled();

    const sendTextBtn = getByTestId("send_text_btn");
    expect(sendTextBtn).toBeInTheDocument();
    fireEvent.click(sendTextBtn);

    expect(smsTextInput).not.toBeDisabled();
    fireEvent.change(smsTextInput, { target: { value: "565655" } });

    const verifyBtn = getByTestId("verify_btn");
    expect(verifyBtn).toBeInTheDocument();
    fireEvent.click(verifyBtn);

    const backBtn = getByTestId("back_btn");
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);

    // Authenticator app Method
    const authAppRadio = await waitForElement(() => getByTestId("authenticator_app_radio"));
    expect(authAppRadio).toBeInTheDocument();
    fireEvent.click(authAppRadio);

    expect(proceedBtn).toBeInTheDocument();
    fireEvent.click(proceedBtn);

    const authAppInput = await waitForElement(() => getByTestId("token_input"));
    expect(authAppInput).toBeInTheDocument();
    fireEvent.change(authAppInput, { target: { value: "565655" } });

    expect(verifyBtn).toBeInTheDocument();
    fireEvent.click(verifyBtn);
  });
});

