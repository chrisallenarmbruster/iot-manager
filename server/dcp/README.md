# Node Module for DCP Protocol

This is a node.js library for my [DCP Protocol](https://dcp.rev4labs.com), analogous to the http library for the HTTP protocol. Key features implemented:

- Works on both TCP and UDP transport layers
- TCP Request/Response cycles can be synchronous or asynchronous (i.e. close the TCP socket after sending a request and wait for a response, or leave the socket open and handle responses as they come in)
- Handles socket management and message framing
- Parses DCP messages into Request and Response objects
- Parses DCP JSON bodies into JavaScript objects
- Parses DCP Request URI's into JavaScript objects
- Provides utility methods for creating DCP Request and Response objects
- Provides utility methods for formatting DCP messages from DCP Request and Response objects
- Listen method accepts a callback function for handling incoming messages with Request and Response objects as parameters
- Send method accepts a Request object and a callback function for handling the Response with the Response object as a parameter
- Response callbacks are registered by a unique TRANSACTION-ID header carried on both both requests and responses to tie them together when asynchronous. If no TRANSACTION-ID is provided, one will be generated and applied as a header automatically.
- Uses UDP transport layer for broadcast and multicast scenarios

See the DCP Protocol Specification for protocol details here: [https://dcp.rev4labs.com](https://dcp.rev4labs.com)

### About the DCP Protocol

The Device Control Protocol (DCP) is an application level protocol optimized for the integration, monitoring and control of devices or "things" on a network. It provides a framework for integrating unconventional network devices attached to networks directly, wirelessly or as computer periphery. DCP is a generic, object-oriented protocol which supports connection and connectionless communication between resources. It employs an open ended set of methods for indicating the purpose of a request and builds on the discipline of reference provided by the Uniform Resource Identifier (URI), for indicating the object to which these methods are to be applied. By the typing and negotiation of device data representation, DCP allows applications and devices to be built independently of data representation while maintaining interoperability. It defines an extensible object model that enables the developer to expose objects, properties, methods, and events of a device. Plug-and-play characteristics may be implemented for devices through the reserved user interface and device driver objects. The Device Control Protocol has been designed to provide a natural and comfortable extension of the Internet to "things."

### DCP Scenarios

There are numerous ways to use DCP. Here are a few examples:

<br>

![DCP Fig 1](/images/dcp-fig-1.png)

<br>

![DCP Fig 2](/images/dcp-fig-2.png)

<br>

![DCP Fig 3](/images/dcp-fig-3.png)

<br>

![DCP Fig 4](/images/dcp-fig-4.png)

<br>

![DCP Fig 5](/images/dcp-fig-5.png)
