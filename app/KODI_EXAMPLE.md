================================================
FILE: README.md
================================================
<h1>Antik TV</h1>
<p>
<h3>Kodi doplněk pro Antik TV (CZ i SK)</h3>
<p>
<a href="https://www.xbmc-kodi.cz/prispevek-antik-tv--13396">Vlákno na fóru XBMC-Kodi.cz</a><br><br>

v1.0.7 (8.6.2025)<br>
- přidání podpory Picons Serveru<br><br>

v1.0.6 (27.5.2025)<br>
- ošetření problémových znaků v EPG<br><br>

v1.0.5 (22.4.2025)<br>
- oprava přehrávání archivu<br><br>

v1.0.4 (15.4.2025)<br>
- oprava přehrávání archivu (posun začátku)<br><br>

v1.0.3 (21.2.2025)<br>
- ošetření chybějících žánrů v datech<br><br>
</p>



================================================
FILE: addon.xml
================================================
﻿<addon id="plugin.video.antik" name="Antik TV" provider-name="waladir" version="1.0.7">
  <requires>
    <import addon="xbmc.python" version="3.0.0"/>
    <import addon="script.module.requests" version="2.18.4"/>
    <import addon="inputstream.adaptive" version="19.0.0"/>
    <import addon="script.module.inputstreamhelper" version="0.4.2"/>        
  </requires>
  <extension library="main.py" point="xbmc.python.pluginsource">
    <provides>video</provides>
  </extension>
  <extension library="service.py" point="xbmc.service"/>
  <extension point="xbmc.addon.metadata">
    <summary lang="en_GB">Antik TV</summary>
    <summary lang="sk_SK">Antik TV</summary>
    <summary lang="cs_CZ">Antik TV</summary>
    <description lang="en_GB">
Doplněk pro Antik TV (CZ i SK)

Další informace a podporu najdete na fóru www.xbmc-kodi.cz (https://www.xbmc-kodi.cz/prispevek-antik-tv--13396)    
    </description>
    <description lang="sk_SK">
Doplněk pro Antik TV (CZ i SK)

Další informace a podporu najdete na fóru www.xbmc-kodi.cz (https://www.xbmc-kodi.cz/prispevek-antik-tv--13396)    
    </description>
    <description lang="cs_CZ">
Doplněk pro Antik TV (CZ i SK)

Další informace a podporu najdete na fóru www.xbmc-kodi.cz (https://www.xbmc-kodi.cz/prispevek-antik-tv--13396)    
    </description>
    <platform>all</platform>
    <source>https://github.com/waladir/plugin.video.antik</source>
    <news>
v1.0.7 (8.6.2025)
- přidání podpory Picons Serveru

v1.0.6 (27.5.2025)
- ošetření problémových znaků v EPG

v1.0.5 (22.4.2025)
- oprava přehrávání archivu

v1.0.4 (15.4.2025)
- oprava přehrávání archivu (posun začátku)

v1.0.3 (21.2.2025)
- ošetření chybějících žánrů v datech
   </news>
    <assets>
        <icon>icon.jpg</icon>
    </assets>
  </extension>
</addon>



================================================
FILE: changelog.txt
================================================
v1.0.7 (8.6.2025)
- přidání podpory Picons Serveru

v1.0.6 (27.5.2025)
- ošetření problémových znaků v EPG

v1.0.5 (22.4.2025)
- oprava přehrávání archivu

v1.0.4 (15.4.2025)
- oprava přehrávání archivu (posun začátku)

v1.0.3 (21.2.2025)
- ošetření chybějících žánrů v datech



================================================
FILE: LICENSE.txt
================================================
                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights.  Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received.  You must make sure that they, too, receive
or can get the source code.  And you must show them these terms so they
know their rights.

  Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

  For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software.  For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

  Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so.  This is fundamentally incompatible with the aim of
protecting users' freedom to change the software.  The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable.  Therefore, we
have designed this version of the GPL to prohibit the practice for those
products.  If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

  Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary.  To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

  The precise terms and conditions for copying, distribution and
modification follow.

                       TERMS AND CONDITIONS

  0. Definitions.

  "This License" refers to version 3 of the GNU General Public License.

  "Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

  "The Program" refers to any copyrightable work licensed under this
License.  Each licensee is addressed as "you".  "Licensees" and
"recipients" may be individuals or organizations.

  To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy.  The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

  A "covered work" means either the unmodified Program or a work based
on the Program.

  To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy.  Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

  To "convey" a work means any kind of propagation that enables other
parties to make or receive copies.  Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

  An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License.  If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

  1. Source Code.

  The "source code" for a work means the preferred form of the work
for making modifications to it.  "Object code" means any non-source
form of a work.

  A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

  The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form.  A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or an object code interpreter used to run it.

  The "Corresponding Source" for a work in object code form means all
the source code needed to generate, install, and (for an executable
work) run the object code and to modify the work, including scripts to
control those activities.  However, it does not include the work's
System Libraries, or general-purpose tools or generally available free
programs which are used unmodified in performing those activities but
which are not part of the work.  For example, Corresponding Source
includes interface definition files associated with source files for
the work, and the source code for shared libraries and dynamically
linked subprograms that the work is specifically designed to require,
such as by intimate data communication or control flow between those
subprograms and other parts of the work.

  The Corresponding Source need not include anything that users
can regenerate automatically from other parts of the Corresponding
Source.

  The Corresponding Source for a work in source code form is that
same work.

  2. Basic Permissions.

  All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met.  This License explicitly affirms your unlimited
permission to run the unmodified Program.  The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work.  This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

  You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force.  You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright.  Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of
your copyrighted material outside their relationship with you.

  Conveying under any other circumstances is permitted solely under
the conditions stated below.  Sublicensing is not allowed; section 10
makes it unnecessary.

  3. Protecting Users' Legal Rights From Anti-Circumvention Law.

  No covered work shall be deemed part of an effective technological
measure under any applicable law fulfilling obligations under article
11 of the WIPO copyright treaty adopted on 20 December 1996, or
similar laws prohibiting or restricting circumvention of such
measures.

  When you convey a covered work, you waive any legal power to forbid
circumvention of technological measures to the extent such circumvention
is effected by exercising rights under this License with respect to
the covered work, and you disclaim any intention to limit operation or
modification of the work as a means of enforcing, against the work's
users, your or third parties' legal rights to forbid circumvention of
technological measures.

  4. Conveying Verbatim Copies.

  You may convey verbatim copies of the Program's source code as you
receive it, in any medium, provided that you conspicuously and
appropriately publish on each copy an appropriate copyright notice;
keep intact all notices stating that this License and any
non-permissive terms added in accord with section 7 apply to the code;
keep intact all notices of the absence of any warranty; and give all
recipients a copy of this License along with the Program.

  You may charge any price or no price for each copy that you convey,
and you may offer support or warranty protection for a fee.

  5. Conveying Modified Source Versions.

  You may convey a work based on the Program, or the modifications to
produce it from the Program, in the form of source code under the
terms of section 4, provided that you also meet all of these conditions:

    a) The work must carry prominent notices stating that you modified
    it, and giving a relevant date.

    b) The work must carry prominent notices stating that it is
    released under this License and any conditions added under section
    7.  This requirement modifies the requirement in section 4 to
    "keep intact all notices".

    c) You must license the entire work, as a whole, under this
    License to anyone who comes into possession of a copy.  This
    License will therefore apply, along with any applicable section 7
    additional terms, to the whole of the work, and all its parts,
    regardless of how they are packaged.  This License gives no
    permission to license the work in any other way, but it does not
    invalidate such permission if you have separately received it.

    d) If the work has interactive user interfaces, each must display
    Appropriate Legal Notices; however, if the Program has interactive
    interfaces that do not display Appropriate Legal Notices, your
    work need not make them do so.

  A compilation of a covered work with other separate and independent
works, which are not by their nature extensions of the covered work,
and which are not combined with it such as to form a larger program,
in or on a volume of a storage or distribution medium, is called an
"aggregate" if the compilation and its resulting copyright are not
used to limit the access or legal rights of the compilation's users
beyond what the individual works permit.  Inclusion of a covered work
in an aggregate does not cause this License to apply to the other
parts of the aggregate.

  6. Conveying Non-Source Forms.

  You may convey a covered work in object code form under the terms
of sections 4 and 5, provided that you also convey the
machine-readable Corresponding Source under the terms of this License,
in one of these ways:

    a) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by the
    Corresponding Source fixed on a durable physical medium
    customarily used for software interchange.

    b) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by a
    written offer, valid for at least three years and valid for as
    long as you offer spare parts or customer support for that product
    model, to give anyone who possesses the object code either (1) a
    copy of the Corresponding Source for all the software in the
    product that is covered by this License, on a durable physical
    medium customarily used for software interchange, for a price no
    more than your reasonable cost of physically performing this
    conveying of source, or (2) access to copy the
    Corresponding Source from a network server at no charge.

    c) Convey individual copies of the object code with a copy of the
    written offer to provide the Corresponding Source.  This
    alternative is allowed only occasionally and noncommercially, and
    only if you received the object code with such an offer, in accord
    with subsection 6b.

    d) Convey the object code by offering access from a designated
    place (gratis or for a charge), and offer equivalent access to the
    Corresponding Source in the same way through the same place at no
    further charge.  You need not require recipients to copy the
    Corresponding Source along with the object code.  If the place to
    copy the object code is a network server, the Corresponding Source
    may be on a different server (operated by you or a third party)
    that supports equivalent copying facilities, provided you maintain
    clear directions next to the object code saying where to find the
    Corresponding Source.  Regardless of what server hosts the
    Corresponding Source, you remain obligated to ensure that it is
    available for as long as needed to satisfy these requirements.

    e) Convey the object code using peer-to-peer transmission, provided
    you inform other peers where the object code and Corresponding
    Source of the work are being offered to the general public at no
    charge under subsection 6d.

  A separable portion of the object code, whose source code is excluded
from the Corresponding Source as a System Library, need not be
included in conveying the object code work.

  A "User Product" is either (1) a "consumer product", which means any
tangible personal property which is normally used for personal, family,
or household purposes, or (2) anything designed or sold for incorporation
into a dwelling.  In determining whether a product is a consumer product,
doubtful cases shall be resolved in favor of coverage.  For a particular
product received by a particular user, "normally used" refers to a
typical or common use of that class of product, regardless of the status
of the particular user or of the way in which the particular user
actually uses, or expects or is expected to use, the product.  A product
is a consumer product regardless of whether the product has substantial
commercial, industrial or non-consumer uses, unless such uses represent
the only significant mode of use of the product.

  "Installation Information" for a User Product means any methods,
procedures, authorization keys, or other information required to install
and execute modified versions of a covered work in that User Product from
a modified version of its Corresponding Source.  The information must
suffice to ensure that the continued functioning of the modified object
code is in no case prevented or interfered with solely because
modification has been made.

  If you convey an object code work under this section in, or with, or
specifically for use in, a User Product, and the conveying occurs as
part of a transaction in which the right of possession and use of the
User Product is transferred to the recipient in perpetuity or for a
fixed term (regardless of how the transaction is characterized), the
Corresponding Source conveyed under this section must be accompanied
by the Installation Information.  But this requirement does not apply
if neither you nor any third party retains the ability to install
modified object code on the User Product (for example, the work has
been installed in ROM).

  The requirement to provide Installation Information does not include a
requirement to continue to provide support service, warranty, or updates
for a work that has been modified or installed by the recipient, or for
the User Product in which it has been modified or installed.  Access to a
network may be denied when the modification itself materially and
adversely affects the operation of the network or violates the rules and
protocols for communication across the network.

  Corresponding Source conveyed, and Installation Information provided,
in accord with this section must be in a format that is publicly
documented (and with an implementation available to the public in
source code form), and must require no special password or key for
unpacking, reading or copying.

  7. Additional Terms.

  "Additional permissions" are terms that supplement the terms of this
License by making exceptions from one or more of its conditions.
Additional permissions that are applicable to the entire Program shall
be treated as though they were included in this License, to the extent
that they are valid under applicable law.  If additional permissions
apply only to part of the Program, that part may be used separately
under those permissions, but the entire Program remains governed by
this License without regard to the additional permissions.

  When you convey a copy of a covered work, you may at your option
remove any additional permissions from that copy, or from any part of
it.  (Additional permissions may be written to require their own
removal in certain cases when you modify the work.)  You may place
additional permissions on material, added by you to a covered work,
for which you have or can give appropriate copyright permission.

  Notwithstanding any other provision of this License, for material you
add to a covered work, you may (if authorized by the copyright holders of
that material) supplement the terms of this License with terms:

    a) Disclaiming warranty or limiting liability differently from the
    terms of sections 15 and 16 of this License; or

    b) Requiring preservation of specified reasonable legal notices or
    author attributions in that material or in the Appropriate Legal
    Notices displayed by works containing it; or

    c) Prohibiting misrepresentation of the origin of that material, or
    requiring that modified versions of such material be marked in
    reasonable ways as different from the original version; or

    d) Limiting the use for publicity purposes of names of licensors or
    authors of the material; or

    e) Declining to grant rights under trademark law for use of some
    trade names, trademarks, or service marks; or

    f) Requiring indemnification of licensors and authors of that
    material by anyone who conveys the material (or modified versions of
    it) with contractual assumptions of liability to the recipient, for
    any liability that these contractual assumptions directly impose on
    those licensors and authors.

  All other non-permissive additional terms are considered "further
restrictions" within the meaning of section 10.  If the Program as you
received it, or any part of it, contains a notice stating that it is
governed by this License along with a term that is a further
restriction, you may remove that term.  If a license document contains
a further restriction but permits relicensing or conveying under this
License, you may add to a covered work material governed by the terms
of that license document, provided that the further restriction does
not survive such relicensing or conveying.

  If you add terms to a covered work in accord with this section, you
must place, in the relevant source files, a statement of the
additional terms that apply to those files, or a notice indicating
where to find the applicable terms.

  Additional terms, permissive or non-permissive, may be stated in the
form of a separately written license, or stated as exceptions;
the above requirements apply either way.

  8. Termination.

  You may not propagate or modify a covered work except as expressly
provided under this License.  Any attempt otherwise to propagate or
modify it is void, and will automatically terminate your rights under
this License (including any patent licenses granted under the third
paragraph of section 11).

  However, if you cease all violation of this License, then your
license from a particular copyright holder is reinstated (a)
provisionally, unless and until the copyright holder explicitly and
finally terminates your license, and (b) permanently, if the copyright
holder fails to notify you of the violation by some reasonable means
prior to 60 days after the cessation.

  Moreover, your license from a particular copyright holder is
reinstated permanently if the copyright holder notifies you of the
violation by some reasonable means, this is the first time you have
received notice of violation of this License (for any work) from that
copyright holder, and you cure the violation prior to 30 days after
your receipt of the notice.

  Termination of your rights under this section does not terminate the
licenses of parties who have received copies or rights from you under
this License.  If your rights have been terminated and not permanently
reinstated, you do not qualify to receive new licenses for the same
material under section 10.

  9. Acceptance Not Required for Having Copies.

  You are not required to accept this License in order to receive or
run a copy of the Program.  Ancillary propagation of a covered work
occurring solely as a consequence of using peer-to-peer transmission
to receive a copy likewise does not require acceptance.  However,
nothing other than this License grants you permission to propagate or
modify any covered work.  These actions infringe copyright if you do
not accept this License.  Therefore, by modifying or propagating a
covered work, you indicate your acceptance of this License to do so.

  10. Automatic Licensing of Downstream Recipients.

  Each time you convey a covered work, the recipient automatically
receives a license from the original licensors, to run, modify and
propagate that work, subject to this License.  You are not responsible
for enforcing compliance by third parties with this License.

  An "entity transaction" is a transaction transferring control of an
organization, or substantially all assets of one, or subdividing an
organization, or merging organizations.  If propagation of a covered
work results from an entity transaction, each party to that
transaction who receives a copy of the work also receives whatever
licenses to the work the party's predecessor in interest had or could
give under the previous paragraph, plus a right to possession of the
Corresponding Source of the work from the predecessor in interest, if
the predecessor has it or can get it with reasonable efforts.

  You may not impose any further restrictions on the exercise of the
rights granted or affirmed under this License.  For example, you may
not impose a license fee, royalty, or other charge for exercise of
rights granted under this License, and you may not initiate litigation
(including a cross-claim or counterclaim in a lawsuit) alleging that
any patent claim is infringed by making, using, selling, offering for
sale, or importing the Program or any portion of it.

  11. Patents.

  A "contributor" is a copyright holder who authorizes use under this
License of the Program or a work on which the Program is based.  The
work thus licensed is called the contributor's "contributor version".

  A contributor's "essential patent claims" are all patent claims
owned or controlled by the contributor, whether already acquired or
hereafter acquired, that would be infringed by some manner, permitted
by this License, of making, using, or selling its contributor version,
but do not include claims that would be infringed only as a
consequence of further modification of the contributor version.  For
purposes of this definition, "control" includes the right to grant
patent sublicenses in a manner consistent with the requirements of
this License.

  Each contributor grants you a non-exclusive, worldwide, royalty-free
patent license under the contributor's essential patent claims, to
make, use, sell, offer for sale, import and otherwise run, modify and
propagate the contents of its contributor version.

  In the following three paragraphs, a "patent license" is any express
agreement or commitment, however denominated, not to enforce a patent
(such as an express permission to practice a patent or covenant not to
sue for patent infringement).  To "grant" such a patent license to a
party means to make such an agreement or commitment not to enforce a
patent against the party.

  If you convey a covered work, knowingly relying on a patent license,
and the Corresponding Source of the work is not available for anyone
to copy, free of charge and under the terms of this License, through a
publicly available network server or other readily accessible means,
then you must either (1) cause the Corresponding Source to be so
available, or (2) arrange to deprive yourself of the benefit of the
patent license for this particular work, or (3) arrange, in a manner
consistent with the requirements of this License, to extend the patent
license to downstream recipients.  "Knowingly relying" means you have
actual knowledge that, but for the patent license, your conveying the
covered work in a country, or your recipient's use of the covered work
in a country, would infringe one or more identifiable patents in that
country that you have reason to believe are valid.

  If, pursuant to or in connection with a single transaction or
arrangement, you convey, or propagate by procuring conveyance of, a
covered work, and grant a patent license to some of the parties
receiving the covered work authorizing them to use, propagate, modify
or convey a specific copy of the covered work, then the patent license
you grant is automatically extended to all recipients of the covered
work and works based on it.

  A patent license is "discriminatory" if it does not include within
the scope of its coverage, prohibits the exercise of, or is
conditioned on the non-exercise of one or more of the rights that are
specifically granted under this License.  You may not convey a covered
work if you are a party to an arrangement with a third party that is
in the business of distributing software, under which you make payment
to the third party based on the extent of your activity of conveying
the work, and under which the third party grants, to any of the
parties who would receive the covered work from you, a discriminatory
patent license (a) in connection with copies of the covered work
conveyed by you (or copies made from those copies), or (b) primarily
for and in connection with specific products or compilations that
contain the covered work, unless you entered into that arrangement,
or that patent license was granted, prior to 28 March 2007.

  Nothing in this License shall be construed as excluding or limiting
any implied license or other defenses to infringement that may
otherwise be available to you under applicable patent law.

  12. No Surrender of Others' Freedom.

  If conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot convey a
covered work so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you may
not convey it at all.  For example, if you agree to terms that obligate you
to collect a royalty for further conveying from those to whom you convey
the Program, the only way you could satisfy both those terms and this
License would be to refrain entirely from conveying the Program.

  13. Use with the GNU Affero General Public License.

  Notwithstanding any other provision of this License, you have
permission to link or combine any covered work with a work licensed
under version 3 of the GNU Affero General Public License into a single
combined work, and to convey the resulting work.  The terms of this
License will continue to apply to the part which is the covered work,
but the special requirements of the GNU Affero General Public License,
section 13, concerning interaction through a network will apply to the
combination as such.

  14. Revised Versions of this License.

  The Free Software Foundation may publish revised and/or new versions of
the GNU General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

  Each version is given a distinguishing version number.  If the
Program specifies that a certain numbered version of the GNU General
Public License "or any later version" applies to it, you have the
option of following the terms and conditions either of that numbered
version or of any later version published by the Free Software
Foundation.  If the Program does not specify a version number of the
GNU General Public License, you may choose any version ever published
by the Free Software Foundation.

  If the Program specifies that a proxy can decide which future
versions of the GNU General Public License can be used, that proxy's
public statement of acceptance of a version permanently authorizes you
to choose that version for the Program.

  Later license versions may give you additional or different
permissions.  However, no additional obligations are imposed on any
author or copyright holder as a result of your choosing to follow a
later version.

  15. Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

  16. Limitation of Liability.

  IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS
THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY
GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE
USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF
DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD
PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),
EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGES.

  17. Interpretation of Sections 15 and 16.

  If the disclaimer of warranty and limitation of liability provided
above cannot be given local legal effect according to their terms,
reviewing courts shall apply local law that most closely approximates
an absolute waiver of all civil liability in connection with the
Program, unless a warranty or assumption of liability accompanies a
copy of the Program in return for a fee.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
state the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

  If the program does terminal interaction, make it output a short
notice like this when it starts in an interactive mode:

    <program>  Copyright (C) <year>  <name of author>
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.

The hypothetical commands `show w' and `show c' should show the appropriate
parts of the General Public License.  Of course, your program's commands
might be different; for a GUI interface, you would use an "about box".

  You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU GPL, see
<http://www.gnu.org/licenses/>.

  The GNU General Public License does not permit incorporating your program
into proprietary programs.  If your program is a subroutine library, you
may consider it more useful to permit linking proprietary applications with
the library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.  But first, please read
<http://www.gnu.org/philosophy/why-not-lgpl.html>.



================================================
FILE: main.py
================================================
# -*- coding: utf-8 -*-
import os
import sys 
import xbmcgui
import xbmcplugin
import xbmcaddon

from urllib.parse import parse_qsl

from resources.lib.utils import get_url, check_settings
from resources.lib.session import Session
from resources.lib.channels import Channels, manage_channels, list_channels_edit, list_channels_list_backups, edit_channel, delete_channel, change_channels_numbers
from resources.lib.channels import list_channels_groups, add_channel_group, edit_channel_group, edit_channel_group_list_channels, edit_channel_group_add_channel, edit_channel_group_add_all_channels, edit_channel_group_delete_channel, select_channel_group, delete_channel_group
from resources.lib.live import list_live
from resources.lib.archive import list_archive, list_archive_days, list_program
from resources.lib.stream import play_live, play_archive, play_catchup
from resources.lib.settings import list_settings, list_devices, remove_device
from resources.lib.iptvsc import generate_playlist, generate_epg

if len(sys.argv) > 1:
    _handle = int(sys.argv[1])

def main_menu():
    addon = xbmcaddon.Addon()
    icons_dir = os.path.join(addon.getAddonInfo('path'), 'resources','images')

    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300111))
    url = get_url(action='list_live', label = addon.getLocalizedString(300111))  
    list_item.setArt({ 'thumb' : os.path.join(icons_dir , 'livetv.png'), 'icon' : os.path.join(icons_dir , 'livetv.png') })
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)

    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300112))
    url = get_url(action='list_archive', label = addon.getLocalizedString(300112))  
    list_item.setArt({ 'thumb' : os.path.join(icons_dir , 'archive.png'), 'icon' : os.path.join(icons_dir , 'archive.png') })
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)

    if addon.getSetting('hide_settings') != 'true':
        list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300100))
        url = get_url(action='list_settings', label = addon.getLocalizedString(300100))  
        list_item.setArt({ 'thumb' : os.path.join(icons_dir , 'settings.png'), 'icon' : os.path.join(icons_dir , 'settings.png') })
        xbmcplugin.addDirectoryItem(_handle, url, list_item, True)

    xbmcplugin.endOfDirectory(_handle)

def router(paramstring):
    params = dict(parse_qsl(paramstring))
    check_settings() 
    if params:
        if params['action'] == 'list_live':
            list_live(label = params['label'])
        elif params['action'] == 'play_live':
            play_live(id = params['id'])

        elif params['action'] == 'list_archive':
            list_archive(label = params['label'])
        elif params['action'] == 'list_archive_days':
            list_archive_days(id = params['id'], label = params['label'])
        elif params['action'] == 'list_program':
            list_program(id = params['id'], day_min = params['day_min'], label = params['label'])
        elif params['action'] == 'play_archive':
            play_archive(id = params['id'], start = params['start'], stop = params['stop'])

        elif params['action'] == 'manage_channels':
            manage_channels(label = params['label'])
        elif params['action'] == 'reset_channels_list':
            channels = Channels()
            channels.reset_channels()      
        elif params['action'] == 'restore_channels':
            channels = Channels()
            channels.restore_channels(backup = params['backup'])        
        elif params['action'] == 'list_channels_list_backups':
            list_channels_list_backups(label = params['label'])

        elif params['action'] == 'list_channels_edit':
            list_channels_edit(label = params['label'])
        elif params['action'] == 'edit_channel':
            edit_channel(id = params['id'])
        elif params['action'] == 'delete_channel':
            delete_channel(id = params['id'])
        elif params['action'] == 'change_channels_numbers':
            change_channels_numbers(from_number =params['from_number'], direction = params['direction'])

        elif params['action'] == 'list_channels_groups':
            list_channels_groups(label = params['label'])
        elif params['action'] == 'add_channel_group':
            add_channel_group(label = params['label'])
        elif params['action'] == 'edit_channel_group':
            edit_channel_group(group = params['group'], label = params['label'])
        elif params['action'] == 'delete_channel_group':
            delete_channel_group(group = params['group'])
        elif params['action'] == 'select_channel_group':
            select_channel_group(group = params['group'])

        elif params['action'] == 'edit_channel_group_list_channels':
            edit_channel_group_list_channels(group = params['group'], label = params['label'])
        elif params['action'] == 'edit_channel_group_add_channel':
            edit_channel_group_add_channel(group = params['group'], channel = params['channel'])
        elif params['action'] == 'edit_channel_group_add_all_channels':
            edit_channel_group_add_all_channels(group = params['group'])
        elif params['action'] == 'edit_channel_group_delete_channel':
            edit_channel_group_delete_channel(group = params['group'], channel = params['channel'])

        elif params['action'] == 'list_devices':
            list_devices(label = params['label'])
        elif params['action'] == 'remove_device':
            remove_device(id = params['id'], name = params['name'])

        elif params['action'] == 'list_settings':
            list_settings(label = params['label'])
        elif params['action'] == 'addon_settings':
            xbmcaddon.Addon().openSettings()

        elif params['action'] == 'reset_session':
           session = Session()
           session.remove_session()

        elif params['action'] == 'generate_playlist':
            if 'output_file' in params:
                generate_playlist(params['output_file'])
                xbmcplugin.addDirectoryItem(_handle, '1', xbmcgui.ListItem())
                xbmcplugin.endOfDirectory(_handle, succeeded = True)
            else:
                generate_playlist()
        elif params['action'] == 'generate_epg':
            if 'output_file' in params:
                generate_epg(params['output_file'])
                xbmcplugin.addDirectoryItem(_handle, '1', xbmcgui.ListItem())
                xbmcplugin.endOfDirectory(_handle, succeeded = True)
            else:
                generate_epg()
        elif params['action'] == 'iptsc_play_stream':
            if 'catchup_start_ts' in params and 'catchup_end_ts' in params:
                play_catchup(id = params['id'], start_ts = params['catchup_start_ts'], end_ts = params['catchup_end_ts'])
            else:
                play_live(params['id'])

        else:
            raise ValueError('Neznámý parametr: {0}!'.format(paramstring))
    else:
        main_menu()

if __name__ == '__main__':
    router(sys.argv[2][1:])



================================================
FILE: service.py
================================================
# -*- coding: utf-8 -*-
import sys
import xbmcaddon
import xbmc

from datetime import datetime
import time

from resources.lib.iptvsc import generate_epg

tz_offset = int((time.mktime(datetime.now().timetuple())-time.mktime(datetime.utcnow().timetuple()))/3600)
addon = xbmcaddon.Addon()
if addon.getSetting('disabled_scheduler') == 'true':
    sys.exit()

time.sleep(60)
if not addon.getSetting('epg_interval'):
    interval = 12*60*60
else:
    interval = int(addon.getSetting('epg_interval'))*60*60
next = time.time() + 5*60

while not xbmc.Monitor().abortRequested():
    if(next < time.time()):
        time.sleep(3)
        if addon.getSetting('username') and len(addon.getSetting('username')) > 0 and addon.getSetting('password') and len(addon.getSetting('password')) > 0:
            if addon.getSetting('autogen') == 'true':
                generate_epg()
        if not addon.getSetting('epg_interval'):
            interval = 12*60*60
        else:
            interval = int(addon.getSetting('epg_interval'))*60*60      
        next = time.time() + float(interval)
    time.sleep(1)

addon = None


================================================
FILE: resources/settings.xml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<settings>
	<category label="30000">
                <setting label="30001" type="text" id="username" default=""/>
                <setting label="30002" type="text" id="password" option="hidden" enable="!eq(-1,false)" default=""/>
                <setting label="Device Id" type="text" id="deviceid" enable="false" default=""/>                
                <setting label="Antik TV" type="select" id="antik" values="SK|CZ" default="SK"/>
                <setting label="Nová session" type="action" action="RunPlugin(plugin://plugin.video.antik?action=reset_session)"/>
	</category>
	<category label="30010">
                <setting label="30011" type="bool" id="hide_settings" default="false"/>
                <setting label="Picons Server" type="lsep"/>
                <setting label="Pro loga kanálů použít Picons Server" type="bool" id="use_picons_server" default="false"/>
                <setting label="IP adresa" type="text" id="picons_server_ip" default="127.0.0.1"/>
                <setting label="Port" type="number" id="picons_server_port" default="8083"/>
	</category>    
	<category label="Widevine">
                <setting label="Zobrazení informací" type="action" action="RunScript(script.module.inputstreamhelper,info)"/>
                <setting label="Nastavení InputStream Helper" type="action" action="Addon.OpenSettings(script.module.inputstreamhelper)" option="close"/>                              
                <setting label="(Re)instalovat Widevine CDM" type="action" action="RunScript(script.module.inputstreamhelper,widevine_install)" visible="!system.platform.android"/>  
                <setting label="Odstranit Widevine CDM..." type="action" action="RunScript(script.module.inputstreamhelper, widevine_remove)" visible="!system.platform.android"/>        
	</category>      
	<category label="IPTV Simple Client">
                <setting label="30020" type="folder" id="output_dir" default=""/>
                <setting label="30021" type="bool" id="autogen" default="false"/>
                <setting label="30022" type="slider" id="epg_interval" range="1,1,24" default="12" option="int"/>
                <setting label="Catchup mod" type="select" id="catchup_mode" values="append|default" default="append"/>
                <setting label="30023" type="action" action="RunPlugin(plugin://plugin.video.antik?action=generate_playlist)"/>
                <setting label="30024" type="action" action="RunPlugin(plugin://plugin.video.antik?action=generate_epg)"/>
	</category>      
        <category label="30030">
                <setting label="30031" type="bool" id="log_request_url" default="false"/>
                <setting label="30032" type="bool" id="log_response" default="false"/>
	</category>    
</settings>



================================================
FILE: resources/language/resource.language.cs_CZ/strings.po
================================================
msgid ""
msgstr ""
"Content-Type: text/plain; charset=UTF-8\n"
"Language: cz\n"

# nastaveni

msgctxt "#30000"
msgid "Prihlásenie"
msgstr "Přihlášení"

msgctxt "#30001"
msgid "Prihlasovacie meno"
msgstr "Přihlašovací jméno"

msgctxt "#30002"
msgid "Heslo"
msgstr "Heslo"

msgctxt "#30010"
msgid "Nastavenie"
msgstr "Nastavení"

msgctxt "#30011"
msgid "Skryť nastavenia v menu"
msgstr "Skrýt nastavení v menu"

msgctxt "#30020"
msgid "Adresár pre playlist a EPG"
msgstr "Adresář pro playlist a EPG"

msgctxt "#30021"
msgid "Automaticky generovať EPG"
msgstr "Automaticky generovat EPG"

msgctxt "#30022"
msgid "Interval pre generovanie EPG (hod.)"
msgstr "Interval pro generování EPG (hod.)"

msgctxt "#30023"
msgid "Generovať playlist"
msgstr "Generovat playlist"

msgctxt "#30024"
msgid "Generovať EPG"
msgstr "Generovat EPG"

msgctxt "#30030"
msgid "Logovanie"
msgstr "Logování"

msgctxt "#30031"
msgid "Logovanie požiadaviek"
msgstr "Logování požadavků"

msgctxt "#30032"
msgid "Logovanie odpovedí"
msgstr "Logování odpovědí"

msgctxt "#30040"
msgid "Zobrazenie infomácií"
msgstr "Zobrazení informací"

msgctxt "#30041"
msgid "Nastavenie InputStream Helper"
msgstr "Nastavení InputStream Helper"

msgctxt "#30042"
msgid "(Re)inštalovať Widevine CDM"
msgstr "(Re)instalovat Widevine CDM"

msgctxt "#30043"
msgid "Odstraniť Widevine CDM..."
msgstr "Odstranit Widevine CDM..."

# menu

msgctxt "#300100"
msgid "Nastavenie"
msgstr "Nastavení"

msgctxt "#300101"
msgid "Správa zariadení"
msgstr "Správa zařízení"

msgctxt "#300102"
msgid "Nastavenie doplnku"
msgstr "Nastavení doplňku"

msgctxt "#300103"
msgid "Ručná editácia"
msgstr "Ruční editace"

msgctxt "#300104"
msgid "Vlastné skupiny kanálov"
msgstr "Vlastní skupiny kanálů"

msgctxt "#300105"
msgid "Resetovat zoznam kanálov"
msgstr "Resetovat seznam kanálů"

msgctxt "#300106"
msgid "Obnova zoznamu kanálov"
msgstr "Obnova seznamu kanálů"

msgctxt "#300107"
msgid "Všetky kanály"
msgstr "Všechny kanály"

msgctxt "#300108"
msgid "Skupiny kanálov"
msgstr "Skupiny kanálů"

msgctxt "#300109"
msgid "Pridať kanál"
msgstr "Přidat kanály"

msgctxt "#300110"
msgid "Pridať všetky kanály"
msgstr "Přidat všechny kanály"

msgctxt "#300111"
msgid "Živé vysielanie"
msgstr "Živé vysílání"

msgctxt "#300112"
msgid "Archív"
msgstr "Archiv"

# hlasky

msgctxt "#300200"
msgid "V nastavení je nutné mať vyplnené všetky prihlasovacie údaje a meno zariadenia"
msgstr "V nastavení je nutné mít vyplněné všechny přihlašovací údaje a jméno zařízení"

msgctxt "#300201"
msgid "Chyba pri uložení "
msgstr "Chyba při uložení "

msgctxt "#300202"
msgid "Chyba pri načítaní "
msgstr "Chyba při načtení "

msgctxt "#300203"
msgid "Chyba pri resetu "
msgstr "Chyba při resetu "

msgctxt "#300204"
msgid "Chyba pri volaní "
msgstr "Chyba při volaní "

msgctxt "#300205"
msgid "Bola vytvorená nová session"
msgstr "Byla vytvořená nová session"

msgctxt "#300206"
msgid "Problém pri prihlásení"
msgstr "Problém při přihlášení"

msgctxt "#300207"
msgid "Chyba pri získaní zariadeni"
msgstr "Chyba při získání zařízení"

msgctxt "#300208"
msgid "posledná aktivita"
msgstr "poslední aktivita"

msgctxt "#300209"
msgid "Bol prekročený limit zariadenia. Niektoré je potrebné odstrániť."
msgstr "Byl překročen limit zařízení. Některé je potřeba odstranit."

msgctxt "#300210"
msgid "Nezaregistrované zariadenie. Skúste v nastavení vytvoriť novú session."
msgstr "Nezaregistrované zařízení. Zkuste v nastavení vytvořit novou session."

msgctxt "#300211"
msgid "Problém pri načítaní kanálov"
msgstr "Problém při načtení kanálů"

msgctxt "#300212"
msgid " je použité pri kanáli "
msgstr " je použité u kanálu "

msgctxt "#300213"
msgid "Je potrebné zadať číslo väčšie ako jedna"
msgstr "Je potřeba zadat číslo větší než jedna"

msgctxt "#300214"
msgid "Neexistuje žiadná záloha"
msgstr "Neexistuje žádná záloha"

msgctxt "#300215"
msgid "Chyba uloženia skupiny"
msgstr "Chyba uložení skupiny"

msgctxt "#300216"
msgid "Je nutné zadať názov skupiny"
msgstr "Je nutné zadat název skupiny"

msgctxt "#300217"
msgid "Názov skupiny je už použitý"
msgstr "Název skupiny je už použitý"

msgctxt "#300218"
msgid "Problém pri prehraní streamu"
msgstr "Problém při přehrání streamu"

msgctxt "#300312"
msgid "Nastav adresár pre playlist a EPG!"
msgstr "Nastav adresář pro playlist a EPG!"

msgctxt "#300313"
msgid "Chyba pri uložení playlistu"
msgstr "Chyba při uložení playlistu"

msgctxt "#300314"
msgid "Playlist bol uložený"
msgstr "Playlist byl uložený"

msgctxt "#300315"
msgid "Chyba pri uložení EPG"
msgstr "Chyba při uložení EPG"

msgctxt "#300316"
msgid "EPG bolo uložené"
msgstr "EPG bylo uložené"

msgctxt "#300317"
msgid "Nevrátené žiadne EPG dáta!"
msgstr "Nevrácena žádná EPG data!"

msgctxt "#300318"
msgid "Zoznam kanálov bol resetovaný"
msgstr "Seznam kanálů byl resetovaný"

msgctxt "#300319"
msgid "Chyba pri načítaní zálohy"
msgstr "Chyba při načtení zálohy"

msgctxt "#300320"
msgid "Zoznam kanálov bol obnovený"
msgstr "Seznam kanálů byl obnovený"

msgctxt "#300321"
msgid "Chyba uloženia kanálov"
msgstr "Chyba při uložení kanálů"

msgctxt "#300322"
msgid "Záloha nenájdená"
msgstr "Záloha nenalezena"



# dialogy

msgctxt "#300300"
msgid "Odstránenie zariadenia"
msgstr "Odstranění zařízení"

msgctxt "#300301"
msgid "Naozaj odstrániť zariadenie"
msgstr "Opravdu odstranit zařízení"

msgctxt "#300302"
msgid "Zvýšiť čísla kanálov"
msgstr "Zvýšit čísla kanálů"

msgctxt "#300303"
msgid "Znížiť čísla kanálov"
msgstr "Snížit čísla kanálů"

msgctxt "#300304"
msgid "Odstrániť kanál"
msgstr "Odstranit kanál"

msgctxt "#300305"
msgid "Zvýšiť čísla kanálov od kanála číslo"
msgstr "Zvýšit čísla kanálů počinaje kanálem číslo"

msgctxt "#300306"
msgid "Znížiť čísla kanálov od kanála číslo"
msgstr "Snížit čísla kanálů počinaje kanálem číslo"

msgctxt "#300307"
msgid "Vybrať skupinu"
msgstr "Vybrat skupinu"

msgctxt "#300308"
msgid "Zmazať skupinu"
msgstr "Smazat skupinu"

msgctxt "#300309"
msgid "Názov skupiny"
msgstr "Název skupiny"

msgctxt "#300310"
msgid "Zmazanie skupiny kanálov"
msgstr "Smazání skupiny kanálů"

msgctxt "#300311"
msgid "Naozaj zmazať skupinu kanálov"
msgstr "Opravdu smazat skupinu kanálů"

# data

msgctxt "#300400"
msgid "Pondělok"
msgstr "Pondělí"

msgctxt "#300401"
msgid "Útorok"
msgstr "Úterý"

msgctxt "#300402"
msgid "Streda"
msgstr "Středa"

msgctxt "#300403"
msgid "Štvrtok"
msgstr "Čtvrtek"

msgctxt "#300404"
msgid "Piatok"
msgstr "Pátok"

msgctxt "#300405"
msgid "Sobota"
msgstr "Sobota"

msgctxt "#300406"
msgid "Neděľa"
msgstr "Neděle"

msgctxt "#300407"
msgid "Po"
msgstr "Po"

msgctxt "#300408"
msgid "Út"
msgstr "Út"

msgctxt "#300409"
msgid "St"
msgstr "St"

msgctxt "#300410"
msgid "Št"
msgstr "Čt"

msgctxt "#300411"
msgid "Pi"
msgstr "Pá"

msgctxt "#300412"
msgid "So"
msgstr "So"

msgctxt "#300413"
msgid "Ne"
msgstr "Ne"



================================================
FILE: resources/language/resource.language.en_GB/strings.po
================================================
msgid ""
msgstr ""
"Content-Type: text/plain; charset=UTF-8\n"
"Language: sk\n"

# nastaveni

msgctxt "#30000"
msgid "Prihlásenie"
msgstr ""

msgctxt "#30001"
msgid "Prihlasovacie meno"
msgstr ""

msgctxt "#30002"
msgid "Heslo"
msgstr ""

msgctxt "#30010"
msgid "Nastavenie"
msgstr ""

msgctxt "#30011"
msgid "Skryť nastavenia v menu"
msgstr ""

msgctxt "#30020"
msgid "Adresár pre playlist a EPG"
msgstr ""

msgctxt "#30021"
msgid "Automaticky generovať EPG"
msgstr ""

msgctxt "#30022"
msgid "Interval pre generovanie EPG (hod.)"
msgstr ""

msgctxt "#30023"
msgid "Generovať playlist"
msgstr ""

msgctxt "#30024"
msgid "Generovať EPG"
msgstr ""

msgctxt "#30030"
msgid "Logovanie"
msgstr ""

msgctxt "#30031"
msgid "Logovanie požiadaviek"
msgstr ""

msgctxt "#30032"
msgid "Logovanie odpovedí"
msgstr ""

msgctxt "#30040"
msgid "Zobrazenie infomácií"
msgstr ""

msgctxt "#30041"
msgid "Nastavenie InputStream Helper"
msgstr ""

msgctxt "#30042"
msgid "(Re)inštalovať Widevine CDM"
msgstr ""

msgctxt "#30043"
msgid "Odstraniť Widevine CDM..."
msgstr "Odstranit Widevine CDM..."

# menu

msgctxt "#300100"
msgid "Nastavenie"
msgstr ""

msgctxt "#300101"
msgid "Správa zariadení"
msgstr ""

msgctxt "#300102"
msgid "Nastavenie doplnku"
msgstr ""

msgctxt "#300103"
msgid "Ručná editácia"
msgstr ""

msgctxt "#300104"
msgid "Vlastné skupiny kanálov"
msgstr ""

msgctxt "#300105"
msgid "Resetovat zoznam kanálov"
msgstr ""

msgctxt "#300106"
msgid "Obnova zoznamu kanálov"
msgstr ""

msgctxt "#300107"
msgid "Všetky kanály"
msgstr ""

msgctxt "#300108"
msgid "Skupiny kanálov"
msgstr ""

msgctxt "#300109"
msgid "Pridať kanál"
msgstr ""

msgctxt "#300110"
msgid "Pridať všetky kanály"
msgstr ""

msgctxt "#300111"
msgid "Živé vysielanie"
msgstr ""

msgctxt "#300112"
msgid "Archív"
msgstr ""

# hlasky

msgctxt "#300200"
msgid "V nastavení je nutné mať vyplnené všetky prihlasovacie údaje a meno zariadenia"
msgstr ""

msgctxt "#300201"
msgid "Chyba při uložení "
msgstr ""

msgctxt "#300202"
msgid "Chyba při načtení "
msgstr ""

msgctxt "#300203"
msgid "Chyba při resetu "
msgstr ""

msgctxt "#300204"
msgid "Chyba pri volaní "
msgstr ""

msgctxt "#300205"
msgid "Bola vytvorená nová session"
msgstr ""

msgctxt "#300206"
msgid "Problém pri prihlásení"
msgstr ""

msgctxt "#300207"
msgid "Chyba pri získaní zariadeni"
msgstr ""

msgctxt "#300208"
msgid "posledná aktivita"
msgstr ""

msgctxt "#300209"
msgid "Bol prekročený limit zariadenia. Niektoré je potrebné odstrániť."
msgstr ""

msgctxt "#300210"
msgid "Nezaregistrované zariadenie. Skúste v nastavení vytvoriť novú session."
msgstr ""

msgctxt "#300211"
msgid "Problém pri načítaní kanálov"
msgstr ""

msgctxt "#300212"
msgid " je použité pri kanáli "
msgstr ""

msgctxt "#300213"
msgid "Je potrebné zadať číslo väčšie ako jedna"
msgstr ""

msgctxt "#300214"
msgid "Neexistuje žiadná záloha"
msgstr ""

msgctxt "#300215"
msgid "Chyba uloženia skupiny"
msgstr ""

msgctxt "#300216"
msgid "Je nutné zadať názov skupiny"
msgstr ""

msgctxt "#300217"
msgid "Názov skupiny je už použitý"
msgstr ""

msgctxt "#300218"
msgid "Problém pri prehraní streamu"
msgstr ""

# dialogy

msgctxt "#300300"
msgid "Odstránenie zariadenia"
msgstr ""

msgctxt "#300301"
msgid "Naozaj odstrániť zariadenie"
msgstr ""

msgctxt "#300302"
msgid "Zvýšiť čísla kanálov"
msgstr ""

msgctxt "#300303"
msgid "Znížiť čísla kanálov"
msgstr ""

msgctxt "#300304"
msgid "Odstrániť kanál"
msgstr ""

msgctxt "#300305"
msgid "Zvýšiť čísla kanálov od kanála číslo"
msgstr ""

msgctxt "#300306"
msgid "Znížiť čísla kanálov od kanála číslo"
msgstr ""

msgctxt "#300307"
msgid "Vybrať skupinu"
msgstr ""

msgctxt "#300308"
msgid "Zmazať skupinu"
msgstr ""

msgctxt "#300309"
msgid "Názov skupiny"
msgstr ""

msgctxt "#300310"
msgid "Zmazanie skupiny kanálov"
msgstr ""

msgctxt "#300311"
msgid "Naozaj zmazať skupinu kanálov"
msgstr ""

msgctxt "#300312"
msgid "Nastav adresár pre playlist a EPG!"
msgstr ""

msgctxt "#300313"
msgid "Chyba pri uložení playlistu"
msgstr ""

msgctxt "#300314"
msgid "Playlist bol uložený"
msgstr ""

msgctxt "#300315"
msgid "Chyba pri uložení EPG"
msgstr ""

msgctxt "#300316"
msgid "EPG bolo uložené"
msgstr ""

msgctxt "#300317"
msgid "Nevrátené žiadne EPG dáta!"
msgstr ""

msgctxt "#300318"
msgid "Zoznam kanálov bol resetovaný"
msgstr ""

msgctxt "#300319"
msgid "Chyba pri načítaní zálohy"
msgstr ""

msgctxt "#300320"
msgid "Zoznam kanálov bol obnovený"
msgstr ""

msgctxt "#300321"
msgid "Chyba uloženia kanálov"
msgstr ""

msgctxt "#300322"
msgid "Záloha nenájdená"
msgstr ""

# data

msgctxt "#300400"
msgid "Pondělok"
msgstr ""

msgctxt "#300401"
msgid "Útorok"
msgstr ""

msgctxt "#300402"
msgid "Streda"
msgstr ""

msgctxt "#300403"
msgid "Štvrtok"
msgstr ""

msgctxt "#300404"
msgid "Piatok"
msgstr ""

msgctxt "#300405"
msgid "Sobota"
msgstr ""

msgctxt "#300406"
msgid "Neděľa"
msgstr ""

msgctxt "#300407"
msgid "Po"
msgstr ""

msgctxt "#300408"
msgid "Út"
msgstr ""

msgctxt "#300409"
msgid "St"
msgstr ""

msgctxt "#300410"
msgid "Št"
msgstr ""

msgctxt "#300411"
msgid "Pi"
msgstr ""

msgctxt "#300412"
msgid "So"
msgstr ""

msgctxt "#300413"
msgid "Ne"
msgstr ""




================================================
FILE: resources/lib/__init__.py
================================================
[Empty file]


================================================
FILE: resources/lib/api.py
================================================
# -*- coding: utf-8 -*-
import xbmc
import xbmcaddon

import requests
from resources.lib.utils import ua, get_api_url

class API:
    def __init__(self):
        self.headers = {'User-Agent' : ua, 'Accept' : '*/*', 'Content-type' : 'application/json;charset=UTF-8'} 

    def call_api(self, api, method, cookies, data = None):
        url = get_api_url() + api
        addon = xbmcaddon.Addon()
        if addon.getSetting('log_request_url') == 'true':
            xbmc.log('Antik TV > ' + str(url))
        try:
            if method == 'get':
                response = requests.get(url = url, cookies = cookies, headers = self.headers)
            elif method == 'post':
                response = requests.post(url = url, json = data, cookies = cookies, headers = self.headers)
            try:
                data = response.json()
            except Exception as e:
                xbmc.log('Antik TV> ' + str(response))
                data = {}
            if addon.getSetting('log_response') == 'true':
                xbmc.log('Antik TV > ' + str(data))
            return data
        except Exception as e:
            xbmc.log('Antik TV > ' + addon.getLocalizedString(300204) + str(url) + ': ' + e.reason)
            return { 'err' : e.reason }  




================================================
FILE: resources/lib/archive.py
================================================
# -*- coding: utf-8 -*-
import sys
import xbmcgui
import xbmcplugin
import xbmcaddon
    
from datetime import date, datetime, timedelta
import time
from urllib.parse import quote

from resources.lib.utils import get_url, day_translation, day_translation_short
from resources.lib.channels import Channels 
from resources.lib.epg import get_channel_epg, epg_listitem

if len(sys.argv) > 1:
    _handle = int(sys.argv[1])

def list_archive(label):
    addon = xbmcaddon.Addon()    
    xbmcplugin.setPluginCategory(_handle, label)
    channels = Channels()
    channels_list = channels.get_channels_list('channel_number')
    for number in sorted(channels_list.keys()):  
        if 'archive' not in channels_list[number] or channels_list[number]['archive'] == True:
            list_item = xbmcgui.ListItem(label=channels_list[number]['name'])
            if addon.getSetting('use_picons_server') == 'true':
                list_item.setArt({'icon' : 'http://' + addon.getSetting('picons_server_ip') + ':' + addon.getSetting('picons_server_port') + '/picons/' + quote(channels_list[number]['name'])}) 
            url = get_url(action='list_archive_days', id = channels_list[number]['id'], label = label + ' / ' + channels_list[number]['name'])  
            
            xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    xbmcplugin.endOfDirectory(_handle, cacheToDisc = False)

def list_archive_days(id, label):
    xbmcplugin.setPluginCategory(_handle, label)
    for i in range (8):
        day = date.today() - timedelta(days = i)
        if i == 0:
            den_label = 'Dnes'
            den = 'Dnes'
        elif i == 1:
            den_label = 'Včera'
            den = 'Včera'
        else:
            den_label = day_translation_short[day.strftime('%w')] + ' ' + day.strftime('%d.%m')
            den = day_translation[day.strftime('%w')] + ' ' + day.strftime('%d.%m.%Y')
        list_item = xbmcgui.ListItem(label = den)
        url = get_url(action='list_program', id = id, day_min = i, label = label + ' / ' + den_label)  
        xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    xbmcplugin.endOfDirectory(_handle, cacheToDisc = False)

def list_program(id, day_min, label):
    addon = xbmcaddon.Addon()
    label = label.replace(addon.getLocalizedString(300112) + ' /','')
    xbmcplugin.setPluginCategory(_handle, label)
    xbmcplugin.setContent(_handle, 'twshows')
    today_date = datetime.today() 
    today_start_ts = int(time.mktime(datetime(today_date.year, today_date.month, today_date.day) .timetuple()))
    today_end_ts = today_start_ts + 60*60*24 -1
    if int(day_min) == 0:
        from_ts = today_start_ts - int(day_min)*60*60*24
        to_ts = int(time.mktime(datetime.now().timetuple()))
    else:
        from_ts = today_start_ts - int(day_min)*60*60*24
        to_ts = today_end_ts - int(day_min)*60*60*24
    epg = get_channel_epg(id, from_ts, to_ts)
    for key in sorted(epg.keys(), reverse = False):
        if int(epg[key]['endts']) > int(time.mktime(datetime.now().timetuple()))-60*60*24*7 and int(epg[key]['endts']) < int(time.mktime(datetime.now().timetuple())):
            list_item = xbmcgui.ListItem(label = day_translation_short[datetime.fromtimestamp(epg[key]['startts']).strftime('%w')] + ' ' + datetime.fromtimestamp(epg[key]['startts']).strftime('%d.%m %H:%M') + ' - ' + datetime.fromtimestamp(epg[key]['endts']).strftime('%H:%M') + ' | ' + epg[key]['title'])
            list_item = epg_listitem(list_item = list_item, epg = epg[key], logo = None)
            list_item.setProperty('IsPlayable', 'true')
            list_item.setContentLookup(False)          
            url = get_url(action='play_archive', id = epg[key]['channel_id'], start = epg[key]['start'], stop = epg[key]['stop'])
            xbmcplugin.addDirectoryItem(_handle, url, list_item, False)
    xbmcplugin.endOfDirectory(_handle, cacheToDisc = False)


================================================
FILE: resources/lib/channels.py
================================================
# -*- coding: utf-8 -*-
import os
import sys
import xbmc
import xbmcgui
import xbmcaddon
import xbmcplugin

from xbmcvfs import translatePath
from urllib.parse import quote

import json
import codecs
import time 
from datetime import datetime

from resources.lib.settings import Settings
from resources.lib.api import API
from resources.lib.session import Session
from resources.lib.utils import get_url, plugin_id

if len(sys.argv) > 1:
    _handle = int(sys.argv[1])

def manage_channels(label):
    addon = xbmcaddon.Addon()        
    xbmcplugin.setPluginCategory(_handle, label)
    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300103))
    url = get_url(action='list_channels_edit', label = label + ' / ' + addon.getLocalizedString(300103))  
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300104))
    url = get_url(action='list_channels_groups', label = label + ' / ' + addon.getLocalizedString(300104))  
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300105))
    url = get_url(action='reset_channels_list')  
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300106))
    url = get_url(action='list_channels_list_backups', label = label + ' / ' + addon.getLocalizedString(300106))  
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    xbmcplugin.endOfDirectory(_handle)

def list_channels_edit(label):
    addon = xbmcaddon.Addon()        
    xbmcplugin.setPluginCategory(_handle, label)
    channels = Channels()
    channels_list = channels.get_channels_list('channel_number', visible_filter = False)
    if len(channels_list) > 0:
        for number in sorted(channels_list.keys()):
            if channels_list[number]['visible'] == True:
                list_item = xbmcgui.ListItem(label=str(number) + ' ' + channels_list[number]['name'])
            else:
                list_item = xbmcgui.ListItem(label='[COLOR=gray]' + str(number) + ' ' + channels_list[number]['name'] + '[/COLOR]')
            if addon.getSetting('use_picons_server') == 'true':
                list_item.setArt({'icon' : 'http://' + addon.getSetting('picons_server_ip') + ':' + addon.getSetting('picons_server_port') + '/picons/' + quote(channels_list[number]['name'])}) 
            url = get_url(action='edit_channel', id = channels_list[number]['id'])
            list_item.addContextMenuItems([(addon.getLocalizedString(300302), 'RunPlugin(plugin://' + plugin_id + '?action=change_channels_numbers&from_number=' + str(number) + '&direction=increase)'),       
                                            (addon.getLocalizedString(300303), 'RunPlugin(plugin://' + plugin_id + '?action=change_channels_numbers&from_number=' + str(number) + '&direction=decrease)'),
                                            (addon.getLocalizedString(300304), 'RunPlugin(plugin://' + plugin_id + '?action=delete_channel&id='  + str(channels_list[number]['id']) + ')')])       
            xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
        xbmcplugin.endOfDirectory(_handle, cacheToDisc = False)

def edit_channel(id):
    addon = xbmcaddon.Addon()        
    channels = Channels()
    channels_list = channels.get_channels_list('id', visible_filter = False)
    new_num = xbmcgui.Dialog().numeric(0, 'Číslo kanálu', str(channels_list[id]['channel_number']))
    if len(new_num) > 0 and int(new_num) > 0:
        channels_nums = channels.get_channels_list('channel_number', visible_filter = False)
        if int(new_num) in channels_nums:
            xbmcgui.Dialog().notification('Antik TV', 'Číslo kanálu ' + new_num +  addon.getLocalizedString(300212) + channels_nums[int(new_num)]['name'], xbmcgui.NOTIFICATION_ERROR, 5000)
        else:  
            channels.set_number(id = id, number = new_num)

def delete_channel(id):
    channels = Channels()
    channels.delete_channel(id)
    xbmc.executebuiltin('Container.Refresh')

def change_channels_numbers(from_number, direction):
    addon = xbmcaddon.Addon()        
    channels = Channels()
    if direction == 'increase':
        change = xbmcgui.Dialog().numeric(0, addon.getLocalizedString(300305) + ' ' + str(from_number) + ' o: ', str(1))
    else:
        change = xbmcgui.Dialog().numeric(0, addon.getLocalizedString(300306) + ' ' + str(from_number) + ' o: ', str(1))
    if len(change) > 0:
        change = int(change)
        if change > 0:
            if direction == 'decrease':
                change = change * -1
            channels.change_channels_numbers(from_number, change)
            xbmc.executebuiltin('Container.Refresh')
        else:  
            xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300213), xbmcgui.NOTIFICATION_ERROR, 5000)
    else:  
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300213), xbmcgui.NOTIFICATION_ERROR, 5000)

def list_channels_list_backups(label):
    xbmcplugin.setPluginCategory(_handle, label)
    addon = xbmcaddon.Addon()
    addon_userdata_dir = translatePath(addon.getAddonInfo('profile'))
    channels = Channels()
    backups = channels.get_backups()
    if len(backups) > 0:
        for backup in sorted(backups):
            date_list = backup.replace(addon_userdata_dir, '').replace('channels_backup_', '').replace('.txt', '').split('-')
            item = 'Záloha z ' + date_list[2] + '.' + date_list[1] + '.' + date_list[0] + ' ' + date_list[3] + ':' + date_list[4] + ':' + date_list[5]
            list_item = xbmcgui.ListItem(label = item)
            url = get_url(action='restore_channels', backup = backup)
            xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
        xbmcplugin.endOfDirectory(_handle, cacheToDisc = False)
    else:
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300214), xbmcgui.NOTIFICATION_INFO, 5000)          

def list_channels_groups(label):
    addon = xbmcaddon.Addon()
    xbmcplugin.setPluginCategory(_handle, label)    
    channels_groups = Channels_groups()
    list_item = xbmcgui.ListItem(label='Nová skupina')
    url = get_url(action='add_channel_group', label = 'Nová skupina')  
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    if channels_groups.selected == None:
        list_item = xbmcgui.ListItem(label='[B]' + addon.getLocalizedString(300107) + '[/B]')
    else:  
        list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300107))
    url = get_url(action='list_channels_groups', label = 'Kanály / ' + addon.getLocalizedString(300108))  
    list_item.addContextMenuItems([(addon.getLocalizedString(300307), 'RunPlugin(plugin://' + plugin_id + '?action=select_channel_group&group=all)' ,)])       
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)    
    for channels_group in channels_groups.groups:
        if channels_groups.selected == channels_group:
            list_item = xbmcgui.ListItem(label='[B]' + channels_group + '[/B]')                
        else:
            list_item = xbmcgui.ListItem(label=channels_group)
        url = get_url(action='edit_channel_group', group = channels_group, label = addon.getLocalizedString(300108) + ' / ' + channels_group) 
        list_item.addContextMenuItems([(addon.getLocalizedString(300307), 'RunPlugin(plugin://' + plugin_id + '?action=select_channel_group&group=' + quote(channels_group) + ')'), 
                                      (addon.getLocalizedString(300308), 'RunPlugin(plugin://' + plugin_id + '?action=delete_channel_group&group=' + quote(channels_group) + ')')])       
        xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    xbmcplugin.endOfDirectory(_handle,cacheToDisc = False)

def add_channel_group(label):
    addon = xbmcaddon.Addon()
    input = xbmc.Keyboard('', addon.getLocalizedString(300309))
    input.doModal()
    if not input.isConfirmed(): 
        return
    group = input.getText()
    if len(group) == 0:
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300216), xbmcgui.NOTIFICATION_ERROR, 5000)
        sys.exit()          
    channels_groups = Channels_groups()
    if group in channels_groups.groups:
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300217), xbmcgui.NOTIFICATION_ERROR, 5000)
        sys.exit()          
    channels_groups.add_channels_group(group)    
    xbmc.executebuiltin('Container.Refresh')

def edit_channel_group(group, label):
    addon = xbmcaddon.Addon()
    xbmcplugin.setPluginCategory(_handle, label)    
    channels_groups = Channels_groups()
    channels = Channels()
    channels_list = channels.get_channels_list('name', visible_filter = False)
    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300109))
    url = get_url(action='edit_channel_group_list_channels', group = group, label = group + ' / ' + addon.getLocalizedString(300109))  
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300110))
    url = get_url(action='edit_channel_group_add_all_channels', group = group, label = group + ' / ' + addon.getLocalizedString(300110))   
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    if group in channels_groups.channels:
        for channel in channels_groups.channels[group]:
            if channel in channels_list:
                list_item = xbmcgui.ListItem(label = channels_list[channel]['name'])
                if addon.getSetting('use_picons_server') == 'true':
                    list_item.setArt({'icon' : 'http://' + addon.getSetting('picons_server_ip') + ':' + addon.getSetting('picons_server_port') + '/picons/' + quote(channels_list[channel]['name'])}) 
                url = get_url(action='edit_channel_group', group = group, label = label)  
                list_item.addContextMenuItems([(addon.getLocalizedString(300304), 'RunPlugin(plugin://' + plugin_id + '?action=edit_channel_group_delete_channel&group=' + quote(group) + '&channel='  + quote(channel) + ')',)])       
                xbmcplugin.addDirectoryItem(_handle, url, list_item, False)
    xbmcplugin.endOfDirectory(_handle,cacheToDisc = False)

def delete_channel_group(group):
    addon = xbmcaddon.Addon()
    response = xbmcgui.Dialog().yesno(addon.getLocalizedString(300310), addon.getLocalizedString(300311) + ' ' + group + '?', nolabel = 'Ne', yeslabel = 'Ano')
    if response:
        channels_groups = Channels_groups()
        channels_groups.delete_channels_group(group)
        xbmc.executebuiltin('Container.Refresh')

def select_channel_group(group):
    channels_groups = Channels_groups()
    channels_groups.select_group(group)
    xbmc.executebuiltin('Container.Refresh')
    if (not group in channels_groups.channels or len(channels_groups.channels[group]) == 0) and group != 'all':
        xbmcgui.Dialog().notification('Antik TV', 'Vybraná skupina je prázdná', xbmcgui.NOTIFICATION_WARNING, 5000)    

def edit_channel_group_list_channels(group, label):
    addon = xbmcaddon.Addon()
    xbmcplugin.setPluginCategory(_handle, label)  
    channels_groups = Channels_groups()
    channels = Channels()
    channels_list = channels.get_channels_list('channel_number', visible_filter = False)
    for number in sorted(channels_list.keys()):
        if not group in channels_groups.groups or not group in channels_groups.channels or not channels_list[number]['name'] in channels_groups.channels[group]:
            list_item = xbmcgui.ListItem(label=str(number) + ' ' + channels_list[number]['name'])
            if addon.getSetting('use_picons_server') == 'true':
                list_item.setArt({'icon' : 'http://' + addon.getSetting('picons_server_ip') + ':' + addon.getSetting('picons_server_port') + '/picons/' + quote(channels_list[number]['name'])}) 
            url = get_url(action='edit_channel_group_add_channel', group = group, channel = channels_list[number]['name'])  
            xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    xbmcplugin.endOfDirectory(_handle,cacheToDisc = False)

def edit_channel_group_add_channel(group, channel):
    channels_groups = Channels_groups()
    channels_groups.add_channel_to_group(channel, group)
    xbmc.executebuiltin('Container.Refresh')

def edit_channel_group_add_all_channels(group):
    channels_groups = Channels_groups()
    channels_groups.add_all_channels_to_group(group)
    xbmc.executebuiltin('Container.Refresh')

def edit_channel_group_delete_channel(group, channel):
    channels_groups = Channels_groups()
    channels_groups.delete_channel_from_group(channel, group)
    xbmc.executebuiltin('Container.Refresh')

class Channels:
    def __init__(self):
        self.channels = {}    
        self.valid_to = -1
        self.load_channels()

    def set_visibility(self, id, visibility):
        self.channels[id].update({'visible' : visibility})
        self.save_channels()

    def set_number(self, id, number):
        if id in self.channels:
            self.channels[id].update({'channel_number' : int(number)})
        self.save_channels()

    def delete_channel(self, id):
        if id in self.channels:
            del self.channels[id]
        self.save_channels()

    def change_channels_numbers(self, from_number, change):
        from_number = int(from_number)
        change = int(change)
        channels_list = self.get_channels_list('channel_number', visible_filter = False)
        for number in sorted(channels_list.keys(), reverse = True):
            if number >= from_number:
                self.channels[channels_list[number]['id']].update({'channel_number' : int(number)+int(change)})
        self.save_channels()                

    def get_channels_list(self, bykey = None, visible_filter = True):
        channels = {}
        if bykey == None:
            channels = self.channels
        else:
            for channel in self.channels:
                channels.update({self.channels[channel][bykey] : self.channels[channel]})
        for channel in list(channels):
            if visible_filter == True and channels[channel]['visible'] == False:
                del channels[channel]
        return channels

    def get_channels(self):
        addon = xbmcaddon.Addon()        
        channels = {}
        session = Session()
        api = API()
        post = {'type' : 'TV', 'meta' : {'adult' : True, 'promo' : True}}
        response = api.call_api(api = 'channels', method = 'post', data = post, cookies = session.get_cookies())
        if 'data' not in response:
            xbmcgui.Dialog().notification('Antik TV',addon.getLocalizedString(300211), xbmcgui.NOTIFICATION_ERROR, 5000)
            sys.exit() 
        for channel in response['data']:
            if 'logo' in response['data'][channel]:
                image = response['data'][channel]['logo']
            else:
                image = None
            channels.update({response['data'][channel]['id_content'] : {'id' : response['data'][channel]['id_content'], 'channel_number' : len(channels) + 1, 'antik_number' : int(response['data'][channel]['id']), 'name' : response['data'][channel]['name'], 'logo' : image, 'archive' : response['data'][channel]['meta']['archive'], 'adult' : response['data'][channel]['meta']['adult'],  'visible' : True}})
        return channels

    def load_channels(self):
        settings = Settings()
        data = settings.load_json_data({'filename' : 'channels.txt', 'description' : 'kanálů'})
        if data is not None:
            data = json.loads(data)
            if 'channels' in data and data['channels'] is not None and len(data['channels']) > 0:
                self.valid_to = int(data['valid_to'])
                channels = data['channels']
                for channel in channels:
                    self.channels.update({channel : channels[channel]})
            else:
                self.channels = {}
                self.valid_to = -1
            if not self.valid_to or self.valid_to == -1 or self.valid_to < int(time.time()):
                self.valid_to = -1
                self.merge_channels()
                self.save_channels()
        else:
            self.channels = {}
            self.merge_channels()
            self.save_channels()

    def save_channels(self):
        addon = xbmcaddon.Addon()
        addon_userdata_dir = translatePath(addon.getAddonInfo('profile'))
        filename = os.path.join(addon_userdata_dir, 'channels.txt')
        if os.path.exists(filename):
            self.backup_channels()            
        settings = Settings()
        self.valid_to = int(time.time()) + 60*60*24
        data = json.dumps({'channels' : self.channels, 'valid_to' : self.valid_to})
        settings.save_json_data({'filename' : 'channels.txt', 'description' : 'kanálů'}, data)

    def reset_channels(self):
        addon = xbmcaddon.Addon()
        addon_userdata_dir = translatePath(addon.getAddonInfo('profile')) 
        filename = os.path.join(addon_userdata_dir, 'channels.txt')
        if os.path.exists(filename):
            self.backup_channels()            
        settings = Settings()
        settings.reset_json_data({'filename' : 'channels.txt', 'description' : 'kanálů'})
        self.channels = {}
        self.valid_to = -1
        self.load_channels()
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300318), xbmcgui.NOTIFICATION_INFO, 5000)

    def get_backups(self):
        import glob
        backups = []
        addon = xbmcaddon.Addon()
        addon_userdata_dir = translatePath(addon.getAddonInfo('profile'))
        backups = sorted(glob.glob(os.path.join(addon_userdata_dir, 'channels_backup_*.txt')))
        return backups

    def backup_channels(self):
        import glob, shutil
        max_backups = 10
        addon = xbmcaddon.Addon()
        addon_userdata_dir = translatePath(addon.getAddonInfo('profile'))
        channels = os.path.join(addon_userdata_dir, 'channels.txt')
        suffix = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        filename = os.path.join(addon_userdata_dir, 'channels_backup_' + suffix + '.txt')
        backups = sorted(glob.glob(os.path.join(addon_userdata_dir, 'channels_backup_*.txt')))
        if len(backups) >= max_backups:
            for i in range(len(backups) - max_backups + 1):
                if os.path.exists(backups[i]):
                    os.remove(backups[i]) 
        shutil.copyfile(channels, filename)

    def restore_channels(self, backup):
        addon = xbmcaddon.Addon()
        if os.path.exists(backup):
            try:
                with codecs.open(backup, 'r', encoding='utf-8') as file:
                    for row in file:
                        data = row[:-1]
            except IOError as error:
                if error.errno != 2:
                    xbmcgui.Dialog().notification('Rebi.tv', addon.getLocalizedString(300319), xbmcgui.NOTIFICATION_ERROR, 5000)
            if data is not None:
                try:            
                    data = json.loads(data)
                    if 'valid_to' in data:
                        data['valid_to'] = int(time.time()) + 60*60*24
                        data = json.dumps(data)
                        addon = xbmcaddon.Addon()
                        addon_userdata_dir = translatePath(addon.getAddonInfo('profile'))
                        filename = os.path.join(addon_userdata_dir, 'channels.txt')
                        try:
                            with codecs.open(filename, 'w', encoding='utf-8') as file:
                                file.write('%s\n' % data)
                                xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300320), xbmcgui.NOTIFICATION_INFO, 5000) 
                        except IOError:
                            xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300321), xbmcgui.NOTIFICATION_ERROR, 5000)      
                except:
                    xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300319), xbmcgui.NOTIFICATION_ERROR, 5000)
        else:
            xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300322), xbmcgui.NOTIFICATION_ERROR, 5000)      

    def merge_channels(self):
        antik_channels = self.get_channels()
        max_number = 0
        if len(self.channels) > 0:
            max_number = self.channels[max(self.channels, key = lambda channel: self.channels[channel]['channel_number'])]['channel_number']
        for channel in sorted(antik_channels, key = lambda channel: antik_channels[channel]['channel_number']):
            if channel in self.channels:
                if self.channels[channel]['name'] != antik_channels[channel]['name']:
                    self.channels[channel].update({'name' : antik_channels[channel]['name']})
                if self.channels[channel]['antik_number'] != antik_channels[channel]['antik_number']:
                    self.channels[channel].update({'antik_number' : antik_channels[channel]['antik_number']})
                if self.channels[channel]['logo'] != antik_channels[channel]['logo']:
                    self.channels[channel].update({'logo' : antik_channels[channel]['logo']})
                if 'archive' not in self.channels[channel] or self.channels[channel]['archive'] != antik_channels[channel]['archive']:
                    self.channels[channel].update({'archive' : antik_channels[channel]['archive']})                    
                if 'adult' not in self.channels[channel] or self.channels[channel]['adult'] != antik_channels[channel]['adult']:
                    self.channels[channel].update({'adult' : antik_channels[channel]['adult']})                    
            else:
                max_number = max_number + 1
                antik_channels[channel]['channel_number'] = max_number
                self.channels.update({channel : antik_channels[channel]})
        for channel in list(self.channels):
            if channel not in antik_channels:
                del self.channels[channel]

class Channels_groups:
    def __init__(self):
        self.groups = []
        self.channels = {}
        self.selected = None
        self.load_channels_groups()

    def add_channel_to_group(self, channel, group):
        channel_group = []
        channels = Channels()
        channels_list = channels.get_channels_list('channel_number', visible_filter = False)
    
        for number in sorted(channels_list.keys()):
            if (group in self.channels and channels_list[number]['name'] in self.channels[group]) or channels_list[number]['name'] == channel:
                channel_group.append(channels_list[number]['name'])
        if group in self.channels:
            del self.channels[group]
        self.channels.update({group : channel_group})
        self.save_channels_groups()
        if group == self.selected:
            self.select_group(group) 

    def add_all_channels_to_group(self, group):
        channel_group = []
        channels = Channels()
        channels_list = channels.get_channels_list('channel_number', visible_filter = False)
        if group in self.channels:
            del self.channels[group]
        for number in sorted(channels_list.keys()):
            channel_group.append(channels_list[number]['name'])
        self.channels.update({group : channel_group})
        self.save_channels_groups()
        if group == self.selected:
            self.select_group(group) 

    def delete_channel_from_group(self, channel, group):
        self.channels[group].remove(channel)
        self.save_channels_groups()
        if group == self.selected:
            self.select_group(group) 

    def add_channels_group(self, group):
        self.groups.append(group)
        self.save_channels_groups()

    def delete_channels_group(self, group):
        self.groups.remove(group)
        if group in self.channels:
            del self.channels[group]
        if self.selected == group:
            self.selected = None
            self.save_channels_groups()
            self.select_group('all')
        self.save_channels_groups()

    def select_group(self, group):
        channels = Channels()
        if group == 'all':
            self.selected = None
            channels_list = channels.get_channels_list(visible_filter = False)
            for channel in channels_list:
                channels.set_visibility(channel, True)
        else:
            self.selected = group
            if group in self.channels and len(self.channels[group]):
                channels_list = channels.get_channels_list(visible_filter = False)
                for channel in channels_list:
                    if channels_list[channel]['name'] in self.channels[group]:
                        channels.set_visibility(channel, True)
                    else:
                        channels.set_visibility(channel, False)
        self.save_channels_groups()      

    def load_channels_groups(self):
        addon = xbmcaddon.Addon()
        addon_userdata_dir = translatePath(addon.getAddonInfo('profile')) 
        filename = os.path.join(addon_userdata_dir, 'channels_groups.txt')
        try:
            with codecs.open(filename, 'r', encoding='utf-8') as file:
                for line in file:
                    if line[:-1].find(';') != -1:
                        channel_group = line[:-1].split(';')
                        if channel_group[0] in self.channels:
                            groups = self.channels[channel_group[0]]
                            groups.append(channel_group[1])
                            self.channels.update({channel_group[0] : groups})
                        else:
                            self.channels.update({channel_group[0] : [channel_group[1]]})
                    else:
                        group = line[:-1]
                        if group[0] == '*':
                            self.selected = group[1:]
                            self.groups.append(group[1:])
                        else:
                            self.groups.append(group)
        except IOError:
            self.groups = []
            self.channels = {}
            self.selected = None

    def save_channels_groups(self):
        addon = xbmcaddon.Addon()
        addon_userdata_dir = translatePath(addon.getAddonInfo('profile')) 
        filename = os.path.join(addon_userdata_dir, 'channels_groups.txt')
        if(len(self.groups)) > 0:
            try:
                with codecs.open(filename, 'w', encoding='utf-8') as file:
                    for group in self.groups:
                        if group == self.selected:
                            line = '*' + group
                        else:
                            line = group
                        file.write('%s\n' % line)
                    for group in self.groups:
                        if group in self.channels:
                            for channel in self.channels[group]:
                                line = group + ';' + channel
                                file.write('%s\n' % line)
            except IOError:
                xbmcgui.Dialog().notification('Antik TV', 'Chyba uložení skupiny', xbmcgui.NOTIFICATION_ERROR, 5000)      
        else:
            if os.path.exists(filename):
                os.remove(filename) 



================================================
FILE: resources/lib/epg.py
================================================
# -*- coding: utf-8 -*-
from resources.lib.session import Session
from resources.lib.channels import Channels
from resources.lib.api import API
from resources.lib.utils import get_kodi_version

from datetime import datetime
import time

def get_live_epg():
    session = Session()
    api = API()
    epg = []
    post = {'type' : 'TV', 'meta' : {'adult' : True, 'promo' : True}}
    response = api.call_api(api = 'channels', method = 'post', data = post, cookies = session.get_cookies())
    if 'epg' in response:
        for channel in response['epg']:
            if 'content' in channel and channel['content'] is not None:
                for item in channel['content']:
                    startts = int(datetime.fromisoformat(item['Start']).timestamp())
                    endts = int(datetime.fromisoformat(item['Stop']).timestamp())
                    if time.time() >= startts and time.time() <= endts:
                        epg.append({'id' : item['SeriesID'], 'title' : item['Title'], 'channel_id' : channel['id'], 'description' : item['Description'], 'startts' : startts, 'endts' : endts, 'start' : item['Start'], 'stop' : item['Stop'], 'genres' : item['Genres']})
        return epg_api(data = epg, key = 'channel_id')
    else:
        return {}

def get_channel_epg(id, from_ts, to_ts):
    session = Session()
    api = API()
    epg = []
    post = {'date': datetime.fromtimestamp(from_ts).strftime('%Y-%m-%d') ,'offset' : 0, 'limit': 200, 'filter' : [id], 'search' : ''}
    response = api.call_api(api = 'epg/channels', data = post, method = 'post', cookies = session.get_cookies())    
    if len(response) > 0 and 'epg' in response[0]:
        for item in response[0]['epg']:
            startts = int(datetime.fromisoformat(item['Start']).timestamp())
            endts = int(datetime.fromisoformat(item['Stop']).timestamp())
            epg.append({'id' : item['SeriesID'], 'title' : item['Title'], 'channel_id' : item['Channel'], 'description' : item['Description'], 'startts' : startts, 'endts' : endts, 'start' : item['Start'], 'stop' : item['Stop'], 'genres' : item['Genres']})
        return epg_api(data = epg, key = 'startts')
    else:
        return {}

def get_channels_epg(channels):
    today_date = datetime.today() 
    today_start_ts = int(time.mktime(datetime(today_date.year, today_date.month, today_date.day) .timetuple()))
    session = Session()
    api = API()
    epg = []
    for day in range(-7, 7, 1):
        post = {'date': datetime.fromtimestamp(today_start_ts + (day* 60*60*24)).strftime('%Y-%m-%d') ,'offset' : 0, 'limit': 200, 'filter' : channels, 'search' : ''}
        response = api.call_api(api = 'epg/channels', data = post, method = 'post', cookies = session.get_cookies())    
        for channel in response:
            if 'epg' in channel:
                for item in channel['epg']:
                    startts = int(datetime.fromisoformat(item['Start']).timestamp())
                    endts = int(datetime.fromisoformat(item['Stop']).timestamp())
                    epg.append({'id' : item['SeriesID'], 'title' : item['Title'], 'channel_id' : item['Channel'], 'description' : item['Description'], 'startts' : startts, 'endts' : endts, 'start' : item['Start'], 'stop' : item['Stop'], 'genres' : item['Genres']})
    return epg


def epg_api(data, key):
    epg = {}
    channels = Channels()
    channels_list = channels.get_channels_list('id', visible_filter = False)            
    for item in data:
        id = item['id']
        channel_id = item['channel_id']
        title = item['title']
        description = item['description']
        startts = item['startts']
        endts = item['endts']
        start = item['start']
        stop = item['stop']
        genres = item['genres']
        epg_item = {'id' : id, 'title' : title, 'channel_id' : channel_id, 'description' : description, 'startts' : startts, 'endts' : endts, 'start' : start, 'stop' : stop, 'genres' : genres}
        if key == 'startts':
            epg.update({startts : epg_item})
        elif key == 'channel_id':
            epg.update({channel_id : epg_item})
        elif key == 'id':
            epg.update({id : epg_item})
        elif key == 'startts_channel_number':
            if channel_id in channels_list:
                epg.update({int(str(startts)+str(channels_list[channel_id]['channel_number']).zfill(5))  : epg_item})
    return epg

def epg_listitem(list_item, epg, logo):
    kodi_version = get_kodi_version()
    genres = []
    if kodi_version >= 20:
        infotag = list_item.getVideoInfoTag()
        infotag.setMediaType('movie')
    else:
        list_item.setInfo('video', {'mediatype' : 'movie'})   
    if logo is not None:
        list_item.setArt({'icon' : logo}) 
    if 'description' in epg and len(epg['description']) > 0:
        if kodi_version >= 20:
            infotag.setPlot(epg['description'])
        else:
            list_item.setInfo('video', {'plot': epg['description']})
    if 'genres' in epg and epg['genres'] is not None and len(epg['genres']) > 0:
        for genre in epg['genres']:      
          genres.append(genre)
        if kodi_version >= 20:
            infotag.setGenres(genres)
        else:
            list_item.setInfo('video', {'genre' : genres})          
    return list_item




================================================
FILE: resources/lib/iptvsc.py
================================================
# -*- coding: utf-8 -*-
import sys

import xbmcgui
import xbmcaddon
import xbmcvfs

from datetime import datetime
import time
from urllib.parse import quote

from resources.lib.channels import Channels
from resources.lib.utils import plugin_id, replace_by_html_entity
from resources.lib.epg import get_channels_epg

tz_offset = int((time.mktime(datetime.now().timetuple())-time.mktime(datetime.utcnow().timetuple()))/3600)

def save_file_test():
    addon = xbmcaddon.Addon()  
    try:
        content = ''
        output_dir = addon.getSetting('output_dir')      
        test_file = output_dir + 'test.fil'
        file = xbmcvfs.File(test_file, 'w')
        file.write(bytearray(('test').encode('utf-8')))
        file.close()
        file = xbmcvfs.File(test_file, 'r')
        content = file.read()
        if len(content) > 0 and content == 'test':
            file.close()
            xbmcvfs.delete(test_file)
            return 1  
        file.close()
        xbmcvfs.delete(test_file)
        return 0
    except Exception:
        file.close()
        xbmcvfs.delete(test_file)
        return 0 

def generate_playlist(output_file = ''):
    addon = xbmcaddon.Addon()
    if addon.getSetting('output_dir') is None or len(addon.getSetting('output_dir')) == 0:
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300312), xbmcgui.NOTIFICATION_ERROR, 5000)
        sys.exit() 
             
    channels = Channels()
    channels_list = channels.get_channels_list('channel_number')

    if len(output_file) > 0:
        filename = output_file
    else:
        filename = addon.getSetting('output_dir') + 'playlist.m3u'

    if save_file_test() == 0:
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300313), xbmcgui.NOTIFICATION_ERROR, 5000)
        return
    try:
        file = xbmcvfs.File(filename, 'w')
        if file == None:
            xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300313), xbmcgui.NOTIFICATION_ERROR, 5000)
        else:
            file.write(bytearray(('#EXTM3U\n').encode('utf-8')))
            for number in sorted(channels_list.keys()):  
                if addon.getSetting('use_picons_server') == 'true':
                    logo = 'http://' + addon.getSetting('picons_server_ip') + ':' + addon.getSetting('picons_server_port') + '/picons/' + quote(channels_list[number]['name'])
                else:
                    logo = channels_list[number]['logo']
                    if logo is None:
                        logo = ''
                if 'archive' not in channels_list[number] or channels_list[number]['archive'] == True:                    
                    if addon.getSetting('catchup_mode') == 'default':
                        line = '#EXTINF:-1 catchup="default" catchup-days="7" catchup-source="plugin://' + plugin_id + '/?action=iptsc_play_stream&id=' + str(channels_list[number]['id']) + '&catchup_start_ts={utc}&catchup_end_ts={utcend}" tvg-chno="' + str(number) + '" tvg-id="' + channels_list[number]['name'] + '" tvh-epg="0" tvg-logo="' + logo + '",' + channels_list[number]['name']
                    else:
                        line = '#EXTINF:-1 catchup="append" catchup-days="7" catchup-source="&catchup_start_ts={utc}&catchup_end_ts={utcend}" tvg-chno="' + str(number) + '" tvg-id="' + channels_list[number]['name'] + '" tvh-epg="0" tvg-logo="' + logo + '",' + channels_list[number]['name']
                else:
                    line = '#EXTINF:-1 tvg-chno="' + str(number) + '" tvg-id="' + channels_list[number]['name'] + '" tvh-epg="0" tvg-logo="' + logo + '",' + channels_list[number]['name']                    
                file.write(bytearray((line + '\n').encode('utf-8')))
                line = 'plugin://' + plugin_id + '/?action=iptsc_play_stream&id=' + str(channels_list[number]['id'])
                if addon.getSetting('isa') == 'true':
                    file.write(bytearray(('#KODIPROP:inputstream=inputstream.ffmpegdirect\n').encode('utf-8')))
                    file.write(bytearray(('#KODIPROP:inputstream.ffmpegdirect.stream_mode=timeshift\n').encode('utf-8')))
                    file.write(bytearray(('#KODIPROP:inputstream.ffmpegdirect.is_realtime_stream=true\n').encode('utf-8')))
                    file.write(bytearray(('#KODIPROP:mimetype=video/mp2t\n').encode('utf-8')))
                file.write(bytearray((line + '\n').encode('utf-8')))
            file.close()
            xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300314), xbmcgui.NOTIFICATION_INFO, 5000)    
    except Exception:
        file.close()
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300313), xbmcgui.NOTIFICATION_ERROR, 5000)

def generate_epg(output_file = ''):
    addon = xbmcaddon.Addon()
    channels_ids = []
    channels = Channels()
    channels_list = channels.get_channels_list('channel_number', visible_filter = False)
    channels_list_by_id = channels.get_channels_list('id', visible_filter = False)

    if len(channels_list) > 0:
        if save_file_test() == 0:
            xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300315), xbmcgui.NOTIFICATION_ERROR, 5000)
            return
        output_dir = addon.getSetting('output_dir') 
        try:
            if len(output_file) > 0:
                file = xbmcvfs.File(output_file, 'w')
            else:
                file = xbmcvfs.File(output_dir + 'antik_epg.xml', 'w')
            if file == None:
                xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300315), xbmcgui.NOTIFICATION_ERROR, 5000)
            else:
                file.write(bytearray(('<?xml version="1.0" encoding="UTF-8"?>\n').encode('utf-8')))
                file.write(bytearray(('<tv generator-info-name="EPG grabber">\n').encode('utf-8')))
                content = ''
                for number in sorted(channels_list.keys()):
                    if addon.getSetting('use_picons_server') == 'true':
                        logo = 'http://' + addon.getSetting('picons_server_ip') + ':' + addon.getSetting('picons_server_port') + '/picons/' + quote(channels_list[number]['name'])
                    else:
                        logo = channels_list[number]['logo']
                        if logo is None:
                            logo = ''
                    channels_ids.append(channels_list[number]['id'])
                    channel = channels_list[number]['name']
                    content = content + '    <channel id="' + replace_by_html_entity(channel) + '">\n'
                    content = content + '            <display-name lang="cs">' + replace_by_html_entity(channel) + '</display-name>\n'
                    content = content + '            <icon src="' + logo + '" />\n'
                    content = content + '    </channel>\n'
                file.write(bytearray((content).encode('utf-8')))
                for i in range(0, len(channels_ids), 10):
                    cnt = 0
                    content = ''
                    epg = get_channels_epg(channels = channels_ids[i:i+10])
                    for epg_item in epg:
                        starttime = datetime.fromtimestamp(epg_item['startts']).strftime('%Y%m%d%H%M%S')
                        endtime = datetime.fromtimestamp(epg_item['endts']).strftime('%Y%m%d%H%M%S')
                        content = content + '    <programme start="' + starttime + ' +0' + str(tz_offset) + '00" stop="' + endtime + ' +0' + str(tz_offset) + '00" channel="' + replace_by_html_entity(channels_list_by_id[epg_item['channel_id']]['name']) + '">\n'
                        content = content + '       <title lang="cs">' + replace_by_html_entity(str(epg_item['title'])) + '</title>\n'
                        if epg_item['description'] != None and len(epg_item['description']) > 0:
                            content = content + '       <desc lang="cs">' + replace_by_html_entity(epg_item['description']) + '</desc>\n'
                        if epg_item['genres'] and epg_item['genres'] is not None:
                            for category in epg_item['genres']:
                                content = content + '       <category>' +  replace_by_html_entity(category) + '</category>\n'
                        content = content + '    </programme>\n'
                        cnt = cnt + 1
                        if cnt > 20:
                            file.write(bytearray((content).encode('utf-8')))
                            content = ''
                            cnt = 0
                    file.write(bytearray((content).encode('utf-8')))                          
                file.write(bytearray(('</tv>\n').encode('utf-8')))
                file.close()
                xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300316), xbmcgui.NOTIFICATION_INFO, 5000)    
        except Exception:
            file.close()
            xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300315), xbmcgui.NOTIFICATION_ERROR, 5000)
            sys.exit()
    else:
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300317), xbmcgui.NOTIFICATION_ERROR, 5000)
        sys.exit()



================================================
FILE: resources/lib/live.py
================================================
# -*- coding: utf-8 -*-
import sys
import xbmcgui
import xbmcplugin
import xbmcaddon

from datetime import datetime
from urllib.parse import quote

from resources.lib.channels import Channels 
from resources.lib.epg import get_live_epg, epg_listitem
from resources.lib.utils import get_url

if len(sys.argv) > 1:
    _handle = int(sys.argv[1])

def list_live(label):
    addon = xbmcaddon.Addon()
    xbmcplugin.setPluginCategory(_handle, label)
    xbmcplugin.setContent(_handle, 'twshows')
    channels = Channels()
    channels_list = channels.get_channels_list('channel_number')
    epg = get_live_epg()
    for num in sorted(channels_list.keys()):
        if channels_list[num]['id'] in epg:
            epg_item = epg[channels_list[num]['id']]
            list_item = xbmcgui.ListItem(label = channels_list[num]['name'] + ' | ' + epg_item['title'] + ' | ' + datetime.fromtimestamp(epg_item['startts']).strftime('%H:%M') + ' - ' + datetime.fromtimestamp(epg_item['endts']).strftime('%H:%M'))
            if addon.getSetting('use_picons_server') == 'true':
                list_item = epg_listitem(list_item = list_item, epg = epg_item, logo = 'http://' + addon.getSetting('picons_server_ip') + ':' + addon.getSetting('picons_server_port') + '/picons/' + quote(channels_list[num]['name']))
            else:
                list_item = epg_listitem(list_item = list_item, epg = epg_item, logo = None)
        else:
            list_item = xbmcgui.ListItem(label = channels_list[num]['name'])
            list_item.setInfo('video', {'mediatype':'movie', 'title': channels_list[num]['name']}) 
        list_item.setContentLookup(False)          
        list_item.setProperty('IsPlayable', 'true')
        url = get_url(action='play_live', id = channels_list[num]['id'], title = channels_list[num]['name'])
        xbmcplugin.addDirectoryItem(_handle, url, list_item, False)
    xbmcplugin.endOfDirectory(_handle, cacheToDisc = False)





================================================
FILE: resources/lib/session.py
================================================
# -*- coding: utf-8 -*-
import sys
import xbmcaddon
import xbmcgui

import json
import time 

from resources.lib.api import API
from resources.lib.utils import get_api_url, get_session_cookie
import requests

class Session:
    def __init__(self):
        self.valid_to = -1
        self.load_session()

    def create_session(self):
        self.get_token()

    def get_cookies(self):
        if self.sessionid and self.token:
            return {get_session_cookie() : self.sessionid, 'XSRF-TOKEN' : self.token}
        else:
            return {get_session_cookie()  : '', 'XSRF-TOKEN' : ''}

    def get_token(self):
        addon = xbmcaddon.Addon()
        session = requests.Session()
        api = API()
        req = session.get(get_api_url() + 'sanctum/csrf-cookie', headers = api.headers)
        if req.status_code not in [200, 201, 204]:
            xbmcgui.Dialog().notification('Antik TV',addon.getLocalizedString(300206), xbmcgui.NOTIFICATION_ERROR, 5000)
            sys.exit() 
        post = {'login' : addon.getSetting('username'), 'password' : addon.getSetting('password')} 
        session.post(get_api_url() + 'login', json = post, headers = api.headers)
        cookies = session.cookies.get_dict()
        if req.status_code not in [200, 201, 204] or get_session_cookie() not in cookies or len(cookies[get_session_cookie()]) == 0 or 'XSRF-TOKEN' not in cookies or len(cookies['XSRF-TOKEN']) == 0:
            xbmcgui.Dialog().notification('Antik TV',addon.getLocalizedString(300206), xbmcgui.NOTIFICATION_ERROR, 5000)
            sys.exit() 
        self.sessionid = cookies[get_session_cookie()]
        self.token = cookies['XSRF-TOKEN']
        self.expires = int(time.time()) + 24 * 60 * 60
        self.save_session()
        self.register_device()

    def register_device(self):
        addon = xbmcaddon.Addon()
        api = API()
        device_id = addon.getSetting('deviceid')
        devices = self.get_devices()
        for device in devices:
            if devices[device]['name'] == device_id:
                self.delete_device(id = device, name = devices[device]['name'])

        response = api.call_api(api = 'user', method = 'get', cookies = self.get_cookies())
        if len(response) == 0 or 'device_id' not in response:
            xbmcgui.Dialog().notification('Antik TV',addon.getLocalizedString(300207), xbmcgui.NOTIFICATION_ERROR, 5000)
            sys.exit() 
        user_device_id = response['device_id']
        devices = self.get_devices()
        for device in devices:
            if devices[device]['public_id'] == user_device_id:
                post = {'device_id' : int(device), 'newName' : device_id}
                api.call_api(api = 'changeDeviceName', data = post, method = 'post', cookies = self.get_cookies())                
                return
        xbmcgui.Dialog().notification('Antik TV',addon.getLocalizedString(300209), xbmcgui.NOTIFICATION_ERROR, 5000)

    def refresh_session(self):
        api = API()
        cookies = self.get_cookies()
        if len(cookies[get_session_cookie()]) > 0 and len(cookies['XSRF-TOKEN']) > 0:
            api.call_api(api = 'auth/logout', method = 'get', cookies = cookies)
        self.get_token()
    
    def get_devices(self):
        devices = {}
        addon = xbmcaddon.Addon()
        api = API()
        response = api.call_api(api = 'devices', method = 'get', cookies = self.get_cookies())
        if len(response) == 0:
            xbmcgui.Dialog().notification('Antik TV',addon.getLocalizedString(300207), xbmcgui.NOTIFICATION_ERROR, 5000)
            sys.exit() 
        for device in response:
            if 'id' in device:
                devices.update({device['id'] : {'name' : device['name'], 'public_id' : device['public_id']}})
        if len(devices) == 0:
            xbmcgui.Dialog().notification('Antik TV',addon.getLocalizedString(300207), xbmcgui.NOTIFICATION_ERROR, 5000)
            sys.exit() 
        return devices

    def delete_device(self, id, name):
        addon = xbmcaddon.Addon()
        api = API()
        post = {'device_id' : int(id), 'device_id_name' : name, 'password' : addon.getSetting('password')}
        api.call_api(api = 'removeDevice', data = post, method = 'post', cookies = self.get_cookies())
        self.remove_session()

    def load_session(self):
        from resources.lib.settings import Settings
        settings = Settings()
        data = settings.load_json_data({'filename' : 'session.txt', 'description' : 'session'})
        if data is not None:
            data = json.loads(data)
            self.sessionid = data['sessionid']
            self.token = data['token']
            self.expires = int(data['expires'])
            if self.expires: 
                if self.expires < int(time.time()):
                    self.refresh_session()
            else:
                self.create_session()
        else:
            self.create_session()

    def save_session(self):
        from resources.lib.settings import Settings
        settings = Settings()
        data = json.dumps({'sessionid' : self.sessionid, 'token' : self.token, 'expires' : self.expires})
        settings.save_json_data({'filename' : 'session.txt', 'description' : 'session'}, data)

    def remove_session(self):
        api = API()
        cookies = self.get_cookies()
        if len(cookies[get_session_cookie()]) > 0 and len(cookies['XSRF-TOKEN']) > 0:
            api.call_api(api = 'auth/logout', method = 'get', cookies = cookies)
        from resources.lib.settings import Settings
        addon = xbmcaddon.Addon()
        settings = Settings()
        settings.reset_json_data({'filename' : 'session.txt', 'description' : 'session'})
        self.valid_to = -1
        self.create_session()
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300205), xbmcgui.NOTIFICATION_INFO, 5000)



================================================
FILE: resources/lib/settings.py
================================================
# -*- coding: utf-8 -*-
import os
import sys
import xbmc
import xbmcaddon
import xbmcgui
import xbmcplugin

from xbmcvfs import translatePath
from resources.lib.session import Session
from resources.lib.utils import get_url, check_settings


def list_settings(label):
    addon = xbmcaddon.Addon()
    _handle = int(sys.argv[1])
    xbmcplugin.setPluginCategory(_handle, label)

    list_item = xbmcgui.ListItem(label = 'Kanály')
    url = get_url(action='manage_channels', label = 'Kanály')  
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)

    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300101))
    url = get_url(action='list_devices', label = addon.getLocalizedString(300101))  
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)

    list_item = xbmcgui.ListItem(label = addon.getLocalizedString(300102))
    url = get_url(action='addon_settings', label = addon.getLocalizedString(300102))  
    xbmcplugin.addDirectoryItem(_handle, url, list_item, True)

    xbmcplugin.endOfDirectory(_handle)

def list_devices(label):
    addon = xbmcaddon.Addon()
    _handle = int(sys.argv[1])
    xbmcplugin.setPluginCategory(_handle, label)    
    session = Session()
    devices = session.get_devices()
    device_id = addon.getSetting('deviceid')
    for id in devices:
        if devices[id]['name'] == device_id:
            list_item = xbmcgui.ListItem(label = '[B]' + devices[id]['name'] + '[/B]')
        else:
            list_item = xbmcgui.ListItem(label = devices[id]['name'])
        url = get_url(action='remove_device', id = id, name = devices[id]['name'])  
        xbmcplugin.addDirectoryItem(_handle, url, list_item, True)
    xbmcplugin.endOfDirectory(_handle)

def remove_device(id, name):
    addon = xbmcaddon.Addon()
    response = xbmcgui.Dialog().yesno(addon.getLocalizedString(300300), addon.getLocalizedString(300301) + ' ' + name + '?')
    if response == True:
        session = Session()
        session.delete_device(id, name)
        session.create_session()
        xbmc.executebuiltin('Container.Refresh')

class Settings:
    def __init__(self):
        self.is_settings_ok = check_settings()
           
    def save_json_data(self, file, data):
        addon = xbmcaddon.Addon()
        addon_userdata_dir = translatePath(addon.getAddonInfo('profile'))
        if self.is_settings_ok:
            filename = os.path.join(addon_userdata_dir, file['filename'])
            try:
                with open(filename, "w") as f:
                    f.write('%s\n' % data)
            except IOError:
                xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300201) + file['description'], xbmcgui.NOTIFICATION_ERROR, 5000)

    def load_json_data(self, file):
        data = None
        if self.is_settings_ok:
            addon = xbmcaddon.Addon()
            addon_userdata_dir = translatePath(addon.getAddonInfo('profile'))
            filename = os.path.join(addon_userdata_dir, file['filename'])
            try:
                with open(filename, "r") as f:
                    for row in f:
                        data = row[:-1]
            except IOError as error:
                if error.errno != 2:
                    xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300202) + file['description'], xbmcgui.NOTIFICATION_ERROR, 5000)
        return data    

    def reset_json_data(self, file):
        if self.is_settings_ok:
            addon = xbmcaddon.Addon()
            addon_userdata_dir = translatePath(addon.getAddonInfo('profile'))
            filename = os.path.join(addon_userdata_dir, file['filename'])
            if os.path.exists(filename):
                try:
                    os.remove(filename) 
                except IOError:
                    xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300203) + file['description'], xbmcgui.NOTIFICATION_ERROR, 5000)



================================================
FILE: resources/lib/stream.py
================================================
# -*- coding: utf-8 -*-
import sys
import xbmcgui
import xbmcplugin
import xbmcaddon

from urllib.parse import urlencode

from resources.lib.session import Session
from resources.lib.api import API
from resources.lib.epg import get_channel_epg
from resources.lib.utils import get_api_url

if len(sys.argv) > 1:
    _handle = int(sys.argv[1])

def play_catchup(id, start_ts, end_ts):
    start_ts = int(start_ts)
    end_ts = int(end_ts)
    epg = get_channel_epg(id = id, from_ts = start_ts, to_ts = end_ts)
    if start_ts in epg:
        play_archive(id = epg[start_ts]['channel_id'], start = epg[start_ts]['start'], stop = epg[start_ts]['stop'])
    else:
        play_live(id = id)

def play_live(id):
    addon = xbmcaddon.Addon()
    session = Session()
    api = API()
    post = {'channel' : id }
    response = api.call_api(api = 'channel/detail', data = post, method = 'post', cookies = session.get_cookies())
    if 'data' in response and 'streams' in response['data'] and len(response['data']['streams']) > 0:
        url = response['data']['streams'][0]['url']
        list_item = xbmcgui.ListItem(path = url)
        list_item.setProperty('inputstream', 'inputstream.adaptive')
        if response['data']['streams'][0]['playlist'] == 'm3u8':
            list_item.setProperty('inputstream', 'inputstream.adaptive')
            list_item.setProperty('inputstream.adaptive.manifest_type', 'hls')
        else:
            list_item.setProperty('inputstream.adaptive.manifest_type', 'mpd')
            list_item.setMimeType('application/dash+xml')
        if 'drm' in response['data']['streams'][0]:
            list_item.setProperty('inputstream.adaptive.license_type', 'com.widevine.alpha')
            list_item.setProperty('inputstream.adaptive.license_key', 'https://drm.antik.sk/widevine/key||R{SSM}|')                
        list_item.setContentLookup(False)       
        xbmcplugin.setResolvedUrl(_handle, True, list_item)
    else:
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300218), xbmcgui.NOTIFICATION_ERROR, 5000)

def play_archive(id, start, stop):
    addon = xbmcaddon.Addon()
    session = Session()
    api = API()
    post = {'channelIdentifier' : id, 'showStart' : start, 'showStop' : stop}
    response = api.call_api(api = 'archive/verify', data = post, method = 'post', cookies = session.get_cookies())
    if 'showIdentifier' in response and len(response['showIdentifier']) > 0:
        url = get_api_url() + 'archive/playShow/' + response['showIdentifier']
        list_item = xbmcgui.ListItem(path = url)
        list_item.setProperty('inputstream', 'inputstream.adaptive')
        list_item.setProperty('inputstream.adaptive.manifest_headers', 'cookie=' + urlencode(session.get_cookies()))
        list_item.setProperty('inputstream.adaptive.manifest_type', 'hls')
        list_item.setContentLookup(False)       
        xbmcplugin.setResolvedUrl(_handle, True, list_item)
    else:
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300218), xbmcgui.NOTIFICATION_ERROR, 5000)



================================================
FILE: resources/lib/utils.py
================================================
# -*- coding: utf-8 -*-
import sys
import xbmc
import xbmcaddon
import xbmcgui
import string, random
from urllib.parse import urlencode

plugin_id = 'plugin.video.antik'

addon = xbmcaddon.Addon()
day_translation = {'1' : addon.getLocalizedString(300400), '2' : addon.getLocalizedString(300401), '3' : addon.getLocalizedString(300402), '4' : addon.getLocalizedString(300403), '5' : addon.getLocalizedString(300404), '6' : addon.getLocalizedString(300405), '0' : addon.getLocalizedString(300406)}  
day_translation_short = {'1' : addon.getLocalizedString(300407), '2' : addon.getLocalizedString(300408), '3' : addon.getLocalizedString(300409), '4' : addon.getLocalizedString(300410), '5' : addon.getLocalizedString(300411), '6' : addon.getLocalizedString(300412), '0' : addon.getLocalizedString(300413)}
ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0'
adone = None

_url = sys.argv[0]

def check_settings():
    addon = xbmcaddon.Addon()
    if not addon.getSetting('deviceid'):
        addon.setSetting('deviceid',''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(15)))    
    if not addon.getSetting('username') or not addon.getSetting('password'):
        xbmcgui.Dialog().notification('Antik TV', addon.getLocalizedString(300200), xbmcgui.NOTIFICATION_ERROR, 10000)
        return False
    else:
        return True

def get_url(**kwargs):
    return '{0}?{1}'.format(_url, urlencode(kwargs))

def get_kodi_version():
    return int(xbmc.getInfoLabel('System.BuildVersion').split('.')[0])

# kod od listenera
def getNumbers(txt):
    newstr = ''.join((ch if ch in '0123456789' else ' ') for ch in txt)
    return [int(i) for i in newstr.split()]

def formatnum(num):
    num = str(num)
    return num if len(num) == 2 else '0' + num

def parsedatetime(_short, _long):
    ix = _short.find(' ')
    lnums = getNumbers(_long)
    snums = getNumbers(_short[:ix])
    year = max(lnums)
    day = min(lnums)
    snums.remove(day)
    day = formatnum(day)
    month = formatnum(min(snums))
    day_formated = '%s.%s.%i' % (day, month, year)
    time_formated = parsetime(_short[ix + 1:])
    return '%s %s' % (day_formated, time_formated)

def parsetime(txt):
    merid = xbmc.getRegion('meridiem')
    h, m = getNumbers(txt)
    if merid.__len__() > 2:
        AM, PM = merid.split('/')
        if txt.endswith(AM) and h == 12:
            h = 0
        elif txt.endswith(PM) and h < 12:
            h += 12
    return '%02d:%02d' % (h, m)

def get_api_url():
    addon = xbmcaddon.Addon()
    if addon.getSetting('antik') == 'CZ':
        return 'https://api-cz.webtv.tv/'
    else:
        return 'https://api.webtv.sk/'
    
def get_session_cookie():
    addon = xbmcaddon.Addon()
    if addon.getSetting('antik') == 'CZ':
        return 'webtv_cz_session'
    else:
        return 'webtvapi_session'        
    
def replace_by_html_entity(string):
    return string.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace("'","&apos;").replace('"',"&quot;")    

